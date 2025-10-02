<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

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
        'thumbnail_url',
        'type',
        'average_rating'
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
        return $this->hasOne(\App\Models\Inventory::class, 'motorcycle_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    public function images()
    {
        return $this->hasMany(MotorcycleImage::class);
    }
    public function scopeActive(Builder $q): Builder
    {
        return $q->where('status', 'active');
    }

    public function scopeSearch(Builder $q, ?string $qText): Builder
    {
        if (!$qText) return $q;
        $like = '%' . str_replace('%', '\%', $qText) . '%';
        return $q->where(function (Builder $b) use ($like) {
            $b->where('name', 'ILIKE', $like)
                ->orWhere('description', 'ILIKE', $like);
        });
    }

    public function scopeWhereInCsv(Builder $q, string $column, ?array $values): Builder
    {
        if (empty($values)) return $q;
        return $q->whereIn($column, $values);
    }

    public function scopeRange(Builder $q, string $column, ?int $min, ?int $max): Builder
    {
        if ($min !== null) $q->where($column, '>=', $min);
        if ($max !== null) $q->where($column, '<=', $max);
        return $q;
    }

    public function scopeHasInventory(Builder $q, ?bool $flag): Builder
    {
        if ($flag === null) return $q;
        return $q->whereHas('inventory', function (Builder $b) use ($flag) {
            if ($flag) $b->where('stock', '>', 0);
        });
    }

    public function scopeRatingMin(Builder $q, $min): Builder
    {
        if ($min === null) return $q;
        return $q->where('average_rating', '>=', $min);
    }

    public function scopeSortBy(Builder $q, string $sort): Builder
    {
        return match ($sort) {
            'price_asc' => $q->orderBy('price', 'asc'),
            'price_desc' => $q->orderBy('price', 'desc'),
            'year_desc' => $q->orderBy('year', 'desc'),
            'year_asc' => $q->orderBy('year', 'asc'),
            'oldest' => $q->orderBy('created_at', 'asc'),
            default => $q->orderBy('created_at', 'desc'),
        };
    }

    public function scopeApplyFilters(Builder $q, array $f): Builder
    {
        return $q
            ->active()
            ->when(isset($f['category_id']), fn($qq) => $qq->where('category_id', $f['category_id']))
            ->when(isset($f['seller_id']), fn($qq) => $qq->where('seller_id', $f['seller_id']))
            ->search($f['q'] ?? null)
            ->whereInCsv('brand', $f['brand'] ?? null)
            ->whereInCsv('condition', $f['condition'] ?? null)
            ->whereInCsv('color', $f['color'] ?? null)
            ->whereInCsv('type', $f['type'] ?? null)
            ->range('price', $f['price_min'] ?? null, $f['price_max'] ?? null)
            ->range('year', $f['year_min'] ?? null, $f['year_max'] ?? null)
            ->hasInventory($f['has_inventory'] ?? null)
            ->ratingMin($f['rating_min'] ?? null)
            ->sortBy($f['sort'] ?? 'latest');
    }
    protected static function booted()
    {
        static::saved(fn() => Cache::tags(['motorcycles', 'featured'])->flush());
        static::deleted(fn() => Cache::tags(['motorcycles', 'featured'])->flush());
    }
}
