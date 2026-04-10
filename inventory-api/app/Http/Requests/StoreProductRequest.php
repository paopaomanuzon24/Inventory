<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sku'             => 'required|string|max:50|unique:products,sku',
            'barcode'         => 'nullable|string|max:100|unique:products,barcode',
            'name'            => 'required|string|max:200',
            'description'     => 'nullable|string',
            'category_id'     => 'required|exists:categories,id',
            'unit_id'         => 'required|exists:units,id',
            'cost_price'      => 'required|numeric|min:0',
            'sell_price'      => 'required|numeric|min:0',
            'alert_threshold' => 'required|numeric|min:0',
            'status'          => 'in:active,inactive',
            'image'           => 'nullable|image|mimes:jpeg,png,webp|max:2048',
        ];
    }
}
