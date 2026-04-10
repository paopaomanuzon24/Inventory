<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'sku', 'barcode', 'name', 'description',
        'category_id', 'unit_id', 'cost_price', 'sell_price',
        'stock_qty', 'alert_threshold', 'image', 'status',
    ];

    protected $casts = [
        'cost_price'      => 'float',
        'sell_price'      => 'float',
        'stock_qty'       => 'float',
        'alert_threshold' => 'float',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function isLowStock(): bool
    {
        return $this->stock_qty <= $this->alert_threshold;
    }


}
