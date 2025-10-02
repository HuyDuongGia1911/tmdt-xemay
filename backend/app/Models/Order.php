<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'code',
        'status',
        'total_amount',
        'payment_method',
        'payment_status',
        'paid_at'
    ];
    protected $casts = ['paid_at' => 'datetime',  'address_json' => 'array'];

    public function items()
    {
        return $this->hasMany(\App\Models\OrderItem::class);
    }

    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
