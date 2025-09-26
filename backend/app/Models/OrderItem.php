<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'motorcycle_id', 'price', 'quantity', 'subtotal'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    public function motorcycle()
    {
        return $this->belongsTo(Motorcycle::class);
    }
}
