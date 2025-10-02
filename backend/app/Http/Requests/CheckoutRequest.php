<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
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
            'address' => ['required', 'array'],
            'address.full_name' => ['required', 'string', 'max:120'],
            'address.phone' => ['required', 'string', 'max:20'],
            'address.line1' => ['required', 'string', 'max:200'],
            'address.line2' => ['nullable', 'string', 'max:200'],
            'address.city' => ['required', 'string', 'max:100'],
            'address.district' => ['nullable', 'string', 'max:100'],
            'address.postal_code' => ['nullable', 'string', 'max:20'],
            'payment_method' => ['nullable', 'in:momo,vnpay,cod'],
        ];
    }
}
