<?php

namespace App\Http\Controllers;

use App\Models\Color;
use Illuminate\Http\Request;
use App\Http\Requests\StoreColorRequest;

class ColorController extends Controller
{
    // GET /api/colors
    public function index(Request $request)
    {
        $colors = Color::orderBy('name')->get();
        return response()->json($colors);
    }

    // POST /api/colors
    // tạo màu mới (seller/admin dùng trong dashboard)
    public function store(StoreColorRequest $request)
    {
        $data = $request->validated();

        // tránh trùng name+code (nếu bạn chưa unique ở DB)
        $existing = Color::where('name', $data['name'])
            ->where('code', $data['code'])
            ->first();

        if ($existing) {
            return response()->json($existing, 200);
        }

        $color = Color::create($data);
        return response()->json($color, 201);
    }
}
