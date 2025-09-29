<?php

namespace App\Models;

use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['parent_id', 'name', 'slug'];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }
    public function motorcycles()
    {
        return $this->hasMany(Motorcycle::class);
    }
    protected static function booted()
    {
        static::saved(fn() => Cache::tags(['categories'])->flush());
        static::deleted(fn() => Cache::tags(['categories'])->flush());
    }
}
