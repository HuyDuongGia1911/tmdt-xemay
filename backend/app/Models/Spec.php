<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Spec extends Model
{
    use HasFactory;

    protected $fillable = ['motorcycle_id', 'engine_cc', 'power_hp', 'torque_nm', 'weight_kg', 'year', 'color'];

    public function motorcycle()
    {
        return $this->belongsTo(Motorcycle::class);
    }
}
