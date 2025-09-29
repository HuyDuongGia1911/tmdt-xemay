<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MotorcycleIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:100'],
            'brand' => ['nullable', 'string'], // CSV
            'category_id' => ['nullable', 'integer', 'min:1'],
            'seller_id' => ['nullable', 'integer', 'min:1'],
            'price_min' => ['nullable', 'integer', 'min:0'],
            'price_max' => ['nullable', 'integer', 'min:0'],
            'year_min' => ['nullable', 'integer', 'min:1900', 'max:' . (int)date('Y')],
            'year_max' => ['nullable', 'integer', 'min:1900', 'max:' . (int)date('Y')],
            'condition' => ['nullable', 'string'], // CSV
            'color' => ['nullable', 'string'],     // CSV
            'type' => ['nullable', 'string'],      // CSV
            'has_inventory' => ['nullable', 'boolean'],
            'rating_min' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'sort' => ['nullable', 'in:price_asc,price_desc,year_desc,year_asc,latest,oldest'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function validatedFilters(): array
    {
        $v = $this->validated();

        foreach (['brand', 'condition', 'color', 'type'] as $csvKey) {
            if (!empty($v[$csvKey])) {
                $v[$csvKey] = array_values(array_filter(array_map('trim', explode(',', $v[$csvKey]))));
            }
        }

        $v['per_page'] = $v['per_page'] ?? 12;
        $v['page'] = $v['page'] ?? 1;
        $v['sort'] = $v['sort'] ?? 'latest';
        return $v;
    }
}
