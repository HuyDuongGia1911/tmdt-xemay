<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Đã chặn bằng middleware role:admin
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            // slug có thể tự sinh từ name nếu không truyền
            'slug' => ['nullable', 'string', 'max:255', 'unique:categories,slug'],
        ];
    }
}
