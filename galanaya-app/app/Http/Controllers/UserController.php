<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    //
    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email',
            'is_active'    => 'required|boolean',
            'roles'     => 'required|array',
            'roles.*'   => 'exists:roles,id',
            'business_units' => 'required|array',
            'business_units.*' => 'exists:business_units,id',
            ]);

        $user = new User();
        $user->name     = $validated['name'];
        $user->email    = $validated['email'];
        $user->password = Hash::make('password'); // Hash the password
        $user->is_active = $validated['is_active']; // Optional: Default to false until verified

        $user->save();

        $user->refresh();

        $user->syncRoles($validated['roles']);

        $user->businessUnits()->sync($validated['business_units']);

        return response()->json([
            'message' => 'User registered successfully.',
            'data' => $user,
        ], 201);
    }

    public function getUsers(Request $request) {
        $perPage = $request->get('per_page', 10);

        $businessUnitIds = $request->get('accessible_business_unit_ids');

        $users = User::with('roles', 'businessUnits')
        ->when($businessUnitIds, function ($query) use ($businessUnitIds) {
            $query->whereHas('businessUnits', function ($q) use ($businessUnitIds) {
                $q->whereIn('business_units.id', $businessUnitIds);
            });
        })
        ->orderBy('created_at', 'desc')
        ->paginate($perPage);

    $users->getCollection()->transform(function ($user) {
        $user->role_name = $user->roles->pluck('name')->join(", ");
        unset($user->roles);
        return $user;
    });

        return response()->json([
            'message' => 'Users retrieved successfully.',
            'data' => $users
        ], 200);
    }

    public function getUserById(Request $request, $userId)
    {
        $user = User::with('businessUnits')->find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        $roles = $user->roles->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
            ];
        });

        return response()->json([
            'message' => 'User retrieved successfully.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => $user->is_active,
                'roles' => $roles,
                'business_units' => $user->businessUnits->map(function ($bu) {
                    return [
                        'id' => $bu->id,
                        'name' => $bu->name,
                    ];
                }),
            ]
        ], 200);
    }


    public function updateUserById (Request $request, $userId) {
        $user = User::find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->is_active = $request->is_active;

        $user->save();

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        if ($request->has('business_units')) {
            $user->businessUnits()->sync($request->business_units);
        }

        return response()->json([
            'message' => 'User updated successfully.',
            'data' => $user->load('roles', 'businessUnits')
        ]);
    }

    public function deleteUserById (Request $request, $userId) {
        $user = User::find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ], 200);
    }

    public function checkEmail(Request $request)
    {
        $email = $request->input('email');
        $excludeId = $request->input('exclude_id');

        if (!$email) {
            return response()->json(['exists' => false]);
        }

        $query = User::where('email', $email);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        $exists = $query->exists();

        return response()->json(['exists' => $exists]);
    }

}
