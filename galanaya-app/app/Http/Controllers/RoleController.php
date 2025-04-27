<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    //
    public function getRoles (Request $request) {
        $roles = Role::select('id', 'name')->get();

        return response()->json([
            'message' => 'Roles retrieved successfully.',
            'data' => $roles
        ], 200);
    }

    public function storeRole(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        // Buat role baru
        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web', // sesuaikan jika kamu pakai guard lain
        ]);

        // Berikan permission ke role
        $role->syncPermissions($validated['permissions']);

        return response()->json([
            'message' => 'Role created successfully',
            'role' => $role,
            'permissions' => $role->permissions->pluck('name'),
        ], 201);
    }
}
