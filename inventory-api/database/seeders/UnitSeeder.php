<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Unit;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            ['name' => 'Piece',     'abbreviation' => 'pcs'],
            ['name' => 'Box',       'abbreviation' => 'box'],
            ['name' => 'Kilogram',  'abbreviation' => 'kg'],
            ['name' => 'Gram',      'abbreviation' => 'g'],
            ['name' => 'Liter',     'abbreviation' => 'L'],
            ['name' => 'Meter',     'abbreviation' => 'm'],
            ['name' => 'Dozen',     'abbreviation' => 'doz'],
        ];
        foreach ($units as $unit) Unit::create($unit);
    }
}
