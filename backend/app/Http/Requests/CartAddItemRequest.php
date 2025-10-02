<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CartAddItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    // public function authorize(): bool
    // {
    //     return auth()->check() && auth()->user()->role === 'buyer';
    // }
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'buyer';
    }
    public function rules(): array
    {
        return [
            'motorcycle_id' => ['required', 'integer', 'exists:motorcycles,id'],
            'qty' => ['required', 'integer', 'min:1', 'max:100'],
            'variant' => ['nullable', 'array'],
        ];
    }
}
