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
            'brand_id'    => ['required', 'exists:brands,id'],
            // bỏ brand string khỏi request
            'color_id'    => ['nullable', 'exists:colors,id'],
            // bỏ type khỏi request
            'price'       => ['required', 'numeric', 'min:0'],
            'condition'   => ['required', Rule::in(['new', 'used'])],
            'status'      => ['nullable', Rule::in(['active', 'draft'])],
            'category_id' => ['required', 'exists:categories,id'],
            'thumbnail_url' => ['nullable', 'string', 'max:255'],
            // mở rộng cho thông tin xe
            'year'        => ['nullable', 'integer', 'min:1900', 'max:2100'],

            'description' => ['nullable', 'string'],

            // thông số kỹ thuật (specs)
            'engine_cc'   => ['nullable', 'integer', 'min:0', 'max:2000'],
            'power_hp'    => ['nullable', 'integer', 'min:0', 'max:500'],
            'torque_nm'   => ['nullable', 'integer', 'min:0', 'max:1000'],
            'weight_kg'   => ['nullable', 'integer', 'min:0', 'max:1000'],
        ];
    }
}
