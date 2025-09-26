<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMotorcycleRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => ['nullable', 'string', 'max:255', 'unique:motorcycles,slug'],
            'brand'       => ['required', 'string', 'max:255'],
            'price'       => ['required', 'numeric', 'min:0'],
            'condition'   => ['required', Rule::in(['new', 'used'])],
            'status'      => ['nullable', Rule::in(['active', 'draft'])],
            'category_id' => ['required', 'exists:categories,id'],
            'thumbnail_url' => ['nullable', 'string', 'max:255'],
        ];
    }
}
