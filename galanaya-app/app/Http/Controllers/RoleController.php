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

    public function updateRolesAndPermissions(Request $request, $roleId)
    {
        $validated = $request->validate([
            'role.name' => 'required|string|unique:roles,name,' . $roleId,
            'role.permissions' => 'required|array',
            'role.permissions.*.name' => 'required|exists:permissions,name',
        ]);

        $roleData = $validated['role'];

        $role = Role::findOrFail($roleId);

        $permissionNames = collect($roleData['permissions'])->pluck('name')->toArray();

        $role->syncPermissions($permissionNames);

        return response()->json([
            'message' => 'Role updated successfully',
            'role' => $role,
            'permissions' => $role->permissions->pluck('name'),
        ]);
    }

    public function getRolesAndPermissions(Request $request)
    {
        $roles = Role::with('permissions')->get();

        $data = $roles->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'name' => $permission->name,
                    ];
                }),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function destroyRole(Request $request, $roleId)
    {
        try {
            $role = Role::findOrFail($roleId);

            $role->permissions()->detach();

            $role->delete();

            return response()->json([
                'message' => 'Role deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Role unsuccessfully deleted.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
