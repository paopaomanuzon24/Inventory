<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
  /*   public function authorize(): bool
    {
        return false;
    }
 */
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $id = $this->route('category')->id; // ignore own name on update
        return [
            'name'        => "required|string|max:100|unique:categories,name,{$id}",
            'description' => 'nullable|string|max:500',
            'parent_id'   => "nullable|exists:categories,id|not_in:{$id}",
        ];
    }
}
