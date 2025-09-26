<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Inventory extends Model
{
    use HasFactory;

    protected $table = 'inventory'; // vì tên bảng không theo số nhiều chuẩn
    protected $fillable = ['motorcycle_id', 'stock', 'sku'];

    public function motorcycle()
    {
        return $this->belongsTo(Motorcycle::class);
    }
}
