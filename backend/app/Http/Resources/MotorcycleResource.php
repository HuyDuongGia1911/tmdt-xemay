<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MotorcycleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'brand' => $this->brand,
            'price' => $this->price,
            'year' => $this->year,
            'condition' => $this->condition,
            'color_id' => $this->color_id,
            'type' => $this->type,
            'thumbnail_url' => $this->thumbnail_url ?? null,

            'description' => $this->description,
            // ⭐ multi images
            'images' => $this->images->map(function ($img) {
                return [
                    'id' => $img->id,
                    'url' => $img->url,
                ];
            }),
            'color' => $this->color ? [
                'id' => $this->color->id,
                'name' => $this->color->name,
                'code' => $this->color->code,
            ] : null,
            'average_rating' => $this->average_rating ?? null,
            'category' => [
                'id' => optional($this->category)->id,
                'name' => optional($this->category)->name,
            ],
            'seller' => [
                'id' => optional($this->seller)->id,
                'name' => optional($this->seller)->name,
            ],
            'inventory' => [
                'stock' => optional($this->inventory)->stock,
            ],
            'created_at' => optional($this->created_at)?->toIso8601String(),
        ];
    }
}
