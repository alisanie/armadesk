<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EssentialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (app()->environment() !== 'production') {
            $user = User::create([
                'name' => 'admin',
                'email' => 'admin@admin.com',
                'password' => Hash::make('password'),
            ]);

            $this->command->info("Admin user created");
        }
    }
}
