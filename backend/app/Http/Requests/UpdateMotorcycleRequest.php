<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Motorcycle;

class UpdateMotorcycleRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Policy sẽ check cụ thể bản ghi trong Controller
        return true;
    }

    public function rules(): array
    {
        $routeParam = $this->route('motorcycle') ?? $this->route('id');
        $id = $routeParam instanceof Motorcycle ? $routeParam->id : $routeParam;

        return [
            'name'        => ['sometimes', 'required', 'string', 'max:255'],
            'slug'        => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('motorcycles', 'slug')->ignore($id),
            ],

            'brand_id'    => ['sometimes', 'required', 'exists:brands,id'],
            'price'       => ['sometimes', 'required', 'numeric', 'min:0'],
            'condition'   => ['sometimes', 'required', Rule::in(['new', 'used'])],
            'year'        => ['nullable', 'integer', 'between:1950,' . (date('Y') + 1)],
            'color_id'    => ['nullable', 'exists:colors,id'],
            'status'      => ['nullable', Rule::in(['draft', 'active'])],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'description' => ['nullable', 'string'],

            // spec
            'engine_cc'   => ['nullable', 'integer', 'min:0', 'max:2000'],
            'power_hp'    => ['nullable', 'integer', 'min:0', 'max:500'],
            'torque_nm'   => ['nullable', 'integer', 'min:0', 'max:1000'],
            'weight_kg'   => ['nullable', 'integer', 'min:0', 'max:1000'],
        ];
    }
}
