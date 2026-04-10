<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Unit;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $laptopCat = Category::where('name', 'Laptops')->first();
        $pcs       = Unit::where('abbreviation', 'pcs')->first();

        $products = [
            ['sku'=>'LAP-001','name'=>'Dell XPS 13',       'cost_price'=>800,  'sell_price'=>1100, 'stock_qty'=>12, 'alert_threshold'=>3],
            ['sku'=>'LAP-002','name'=>'MacBook Air M2',    'cost_price'=>1000, 'sell_price'=>1299, 'stock_qty'=>2,  'alert_threshold'=>3],
            ['sku'=>'LAP-003','name'=>'Lenovo ThinkPad X1','cost_price'=>900,  'sell_price'=>1150, 'stock_qty'=>7,  'alert_threshold'=>3],
            ['sku'=>'LAP-004','name'=>'HP Spectre x360',   'cost_price'=>750,  'sell_price'=>1050, 'stock_qty'=>0,  'alert_threshold'=>3],
            ['sku'=>'LAP-005','name'=>'Asus ZenBook 14',   'cost_price'=>600,  'sell_price'=>850,  'stock_qty'=>15, 'alert_threshold'=>5],
        ];

        foreach ($products as $data) {
            Product::create(array_merge($data, [
                'category_id' => $laptopCat->id,
                'unit_id'     => $pcs->id,
            ]));
        }
    }
}
