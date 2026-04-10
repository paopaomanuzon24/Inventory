<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $electronics = Category::create(['name' => 'Electronics',
        'slug' => Str::slug('Electronics')]);
        Category::create(['name' => 'Laptops',  'slug' => Str::slug('Laptops'),  'parent_id' => $electronics->id]);
    Category::create(['name' => 'Phones',   'slug' => Str::slug('Phones'),   'parent_id' => $electronics->id]);

    $office = Category::create(['name' => 'Office Supplies', 'slug' => Str::slug('Office Supplies')]);
    Category::create(['name' => 'Paper',      'slug' => Str::slug('Paper'),      'parent_id' => $office->id]);
    Category::create(['name' => 'Stationery', 'slug' => Str::slug('Stationery'), 'parent_id' => $office->id]);

    Category::create(['name' => 'Food & Beverage', 'slug' => Str::slug('Food & Beverage')]);
    Category::create(['name' => 'Furniture',        'slug' => Str::slug('Furniture')]);
    }
}
