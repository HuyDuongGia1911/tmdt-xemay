<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Seller extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'shop_name', 'phone', 'address', 'logo_url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function motorcycles()
    {
        return $this->hasMany(Motorcycle::class);
    }
}
