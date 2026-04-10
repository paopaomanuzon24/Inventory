<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'parent_id'];

    protected static function booted(): void
    {
        static::creating(function ($cat) {
            $cat->slug = Str::slug($cat->name);
        });
        static::updating(function ($cat) {
            if ($cat->isDirty('name')) {
                $cat->slug = Str::slug($cat->name);
            }
        });
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
