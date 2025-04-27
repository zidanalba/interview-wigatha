<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        User::create([
            'id' => (string) Str::uuid(), // make sure your users table uses UUID
            'name' => 'Super Admin',
            'email' => 'admin@galanaya.com',
            'password' => Hash::make('admin'), // never store plain text
            'is_active' => true
        ]);
    }
}
