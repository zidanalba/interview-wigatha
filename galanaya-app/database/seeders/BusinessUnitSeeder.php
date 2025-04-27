<?php

namespace Database\Seeders;

use App\Models\BusinessUnit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BusinessUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $businessUnits = [
            ['name' => 'Kausa Abhinaya', 'description' => 'Konstruksi dan Pengadaan'],
            ['name' => 'Galanaya', 'description' => 'Penjualan Produk'],
        ];

        foreach ($businessUnits as $businessUnit) {
            BusinessUnit::updateOrCreate(
                ['name' => $businessUnit['name']],
                ['id' => Str::uuid(), 'description' => $businessUnit['description']]
            );
        }
    }
}
