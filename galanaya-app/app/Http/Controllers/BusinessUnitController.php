<?php

namespace App\Http\Controllers;

use App\Models\BusinessUnit;
use Illuminate\Http\Request;

class BusinessUnitController extends Controller
{
    //
    public function getBusinessUnits (Request $request) {
        $units = BusinessUnit::all();

        return response()->json([
            'message' => 'Business Units retrieved successfully.',
            'data' => $units
        ],200);
    }
}
