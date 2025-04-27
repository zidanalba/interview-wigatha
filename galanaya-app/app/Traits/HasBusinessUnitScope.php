<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasBusinessUnitScope
{
    /**
     * Bootstrap the global scope.
     *
     * @return void
     */
    public static function bootHasBusinessUnitScope()
    {
        static::addGlobalScope('business_unit', function (Builder $query) {
            $user = auth()->user();

            // Jika user bukan superadmin, filter data berdasarkan business unit
            /** @var \App\Models\User|\Spatie\Permission\Traits\HasRoles $user */
            if (!$user->hasRole('superadmin')) {
                // Ambil daftar business unit yang dimiliki user
                $unitIds = $user->businessUnits->pluck('id');

                // Tambahkan kondisi pada query untuk membatasi business unit yang bisa dilihat oleh user
                $query->whereIn('business_unit_id', $unitIds);
            }
        });
    }
}
