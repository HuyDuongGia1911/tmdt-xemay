<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Motorcycle extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'seller_id',
        'category_id',
        'name',
        'slug',
        'brand',
        'price',
        'condition',
        'status',
        'thumbnail_url'
    ];

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function spec()
    {
        return $this->hasOne(Spec::class);
    }
    public function inventory()
    {
        return $this->hasOne(Inventory::class);
    }
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
