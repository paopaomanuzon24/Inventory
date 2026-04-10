<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
        'id'              => $this->id,
        'sku'             => $this->sku,
        'barcode'         => $this->barcode,
        'name'            => $this->name,
        'description'     => $this->description,
        'cost_price'      => $this->cost_price,
        'sell_price'      => $this->sell_price,
        'stock_qty'       => $this->stock_qty,
        'alert_threshold' => $this->alert_threshold,
        'status'          => $this->status,
        'is_low_stock'    => $this->isLowStock(),
        'image_url'       => $this->image
                              ? asset('storage/' . $this->image)
                              : null,
        'category'        => $this->whenLoaded('category', fn() => [
            'id' => $this->category->id, 'name' => $this->category->name,
        ]),
        'unit'            => $this->whenLoaded('unit', fn() => [
            'id' => $this->unit->id, 'name' => $this->unit->name,
            'abbreviation' => $this->unit->abbreviation,
        ]),
        'created_at'      => $this->created_at->toDateTimeString(),
        'updated_at'      => $this->updated_at->toDateTimeString(),
    ];
    }
}
