<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    //
    public function getPermissions(Request $request)
    {
        $permissions = Permission::select('id', 'name')->get();

        return response()->json([
            'message' => 'Permissions retrieved successfully.',
            'data' => $permissions
        ]);
    }

}
