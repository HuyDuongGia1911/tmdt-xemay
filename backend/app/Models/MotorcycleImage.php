<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MotorcycleImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'motorcycle_id',
        'url',
    ];

    public function motorcycle()
    {
        return $this->belongsTo(Motorcycle::class);
    }
}
