<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'provider', 'amount', 'currency', 'tx_id', 'status', 'raw_payload'];
    protected $casts = ['raw_payload' => 'array'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
