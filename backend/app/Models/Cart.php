<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cart extends Model
{
    protected $fillable = ['user_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    // Tổng tiền tạm tính theo snapshot (để hiển thị giỏ)
    public function getSubtotalAttribute(): int
    {
        return $this->items->sum(fn($i) => (int)$i->unit_price * (int)$i->qty);
    }
}
