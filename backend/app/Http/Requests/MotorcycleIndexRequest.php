<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MotorcycleIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules()
    {
        return [
            'q'             => 'nullable|string',
            'brand'         => 'nullable|string',
            'price_min'     => 'nullable|numeric|min:0',
            'price_max'     => 'nullable|numeric|min:0',
            'year_min'      => 'nullable|integer',
            'year_max'      => 'nullable|integer',
            'condition'     => 'nullable|string|in:new,used',
            'color'         => 'nullable|string',
            'type'          => 'nullable|string',
            'has_inventory' => 'nullable|in:0,1',
            'rating_min'    => 'nullable|numeric|min:0|max:5',

            'page'          => 'nullable|integer|min:1',
            'per_page'      => 'nullable|integer|min:1|max:100',

            // ✅ KHÔNG dùng in: ... nữa, để khỏi bị 422
            'sort'          => 'nullable|string',
            'category_id'   => 'nullable|integer|exists:categories,id',
            'brand_id'      => 'nullable|integer|exists:brands,id',
        ];
    }

    public function validatedFilters(): array
    {
        $data = $this->validated();

        // danh sách sort hợp lệ
        $allowedSorts = [
            'featured',
            'best_selling',
            'name_asc',
            'name_desc',
            'price_asc',
            'price_desc',
            'oldest',
            'newest',
        ];

        // nếu sort gửi lên không hợp lệ => bỏ
        if (!empty($data['sort']) && !in_array($data['sort'], $allowedSorts, true)) {
            unset($data['sort']);
        }

        // mặc định
        $data['sort']     = $data['sort']     ?? 'featured';
        $data['page']     = $data['page']     ?? 1;
        $data['per_page'] = $data['per_page'] ?? 12;

        return $data;
    }
}
