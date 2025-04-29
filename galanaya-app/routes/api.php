<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BusinessUnitController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::group(['prefix' => 'master'], function () {
        Route::group(['prefix' => 'user'], function () {
            Route::post('/', [UserController::class, 'storeUser']);
            Route::get('/', [UserController::class, 'getUsers']);
            Route::get('check-email', [UserController::class, 'checkEmail']);

            Route::group(['prefix' => '{userId}'], function () {
                Route::get('/', [UserController::class, 'getUserById']);
                Route::put('/', [UserController::class, 'updateUserById']);
                Route::delete('/', [UserController::class, 'deleteUserById']);
            });
        });

        Route::group(['prefix' => 'role'], function () {
            Route::get('/', [RoleController::class, 'getRoles']);
            Route::post('/', [RoleController::class, 'storeRole']);
            Route::put('{roleId}', [RoleController::class, 'updateRolesAndPermissions']);
        });

        Route::group(['prefix' => 'roles-and-permissions'], function () {
            Route::get('/', [RoleController::class, 'getRolesAndPermissions']);
        });

        Route::group(['prefix' => 'permission'], function () {
            Route::get('/', [PermissionController::class, 'getPermissions']);
        });

        Route::group(['prefix' => 'business-unit'], function () {
            Route::get('/', [BusinessUnitController::class, 'getBusinessUnits']);
        });
    });
});
