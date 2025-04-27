<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus cache permission
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view_users',
            'create_users',
            'view_user_detail',
            'update_users',
        ];

        // Buat permission dengan UUID
        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ], [
                'id' => Str::uuid(),
            ]);
        }

        // Define roles and their permissions
        $roles = [
            'superadmin' => $permissions, // assign all permissions to superadmin
        ];

        // Buat roles dengan UUID
        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'web',
            ], [
                'id' => Str::uuid(),
            ]);

            // Ambil permission berdasarkan nama
            $permissionModels = Permission::whereIn('name', $rolePermissions)->get();

            // Sync permissions dengan UUID
            $role->syncPermissions($permissionModels);
        }
    }
}
