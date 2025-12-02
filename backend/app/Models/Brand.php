<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Cache;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'logo_url'];

    public function motorcycles()
    {
        return $this->hasMany(Motorcycle::class);
    }

    protected static function booted()
    {
        // Flush tất cả cache liên quan đến brands khi thay đổi
        static::saved(fn() => Cache::tags(['brands'])->flush());
        static::deleted(fn() => Cache::tags(['brands'])->flush());
    }
}
