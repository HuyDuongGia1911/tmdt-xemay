<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreColorRequest extends FormRequest
{
    public function authorize(): bool
    {
        // cho phép, quyền đã kiểm soát bằng middleware role
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'code' => [
                'required',
                'string',
                'max:9',
                'regex:/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên màu là bắt buộc.',
            'code.required' => 'Mã màu là bắt buộc.',
            'code.regex'    => 'Mã màu phải ở dạng HEX, ví dụ #FF0000.',
        ];
    }
}
