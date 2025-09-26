<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMotorcycleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Policy update sẽ check cụ thể bản ghi
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'name'      => ['sometimes', 'required', 'string', 'max:255'],
            'slug'       => ['nullable', 'string', 'max:255', Rule::unique('motorcycles', 'slug')->ignore($id)],
            'brand'      => ['sometimes', 'required', 'string', 'max:255'],
            'price'      => ['sometimes', 'required', 'numeric', 'min:0'],
            'condition'  => ['sometimes', 'required', Rule::in(['new', 'used'])],
            'year'       => ['sometimes', 'required', 'integer', 'between:1950,' . (date('Y') + 1)],
            'color'      => ['nullable', 'string', 'max:100'],
            'status'     => ['nullable', Rule::in(['draft', 'active'])],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
        ];
    }
}
