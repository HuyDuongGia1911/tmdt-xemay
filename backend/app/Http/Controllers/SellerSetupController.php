<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SellerSetupController extends Controller
{
    // POST /api/seller/setup  (tạo cửa hàng lần đầu)
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->seller) {
            return response()->json([
                'message' => 'Bạn đã có cửa hàng rồi.',
            ], 400);
        }

        $data = $request->validate([
            'shop_name' => 'required|string|max:255',
            'phone'     => 'required|string|max:20',
            'address'   => 'required|string|max:255',
            'logo_url'  => 'nullable|url|max:255',
        ]);

        $seller = $user->seller()->create($data);

        return response()->json([
            'message' => 'Tạo cửa hàng thành công.',
            'seller'  => $seller,
        ], 201);
    }

    // GET /api/seller/profile  (xem thông tin cửa hàng)
    public function show(Request $request)
    {
        $user = $request->user();
        $seller = $user->seller;

        if (!$seller) {
            return response()->json(['message' => 'Seller not found'], 404);
        }

        return response()->json($seller);
    }

    // PUT /api/seller/profile  (cập nhật thông tin cửa hàng)
    public function update(Request $request)
    {
        $user = $request->user();
        $seller = $user->seller;

        if (!$seller) {
            return response()->json(['message' => 'Seller not found'], 404);
        }

        $data = $request->validate([
            'shop_name' => 'required|string|max:255',
            'phone'     => 'required|string|max:20',
            'address'   => 'required|string|max:255',
            'logo_url'  => 'nullable|url|max:255',
        ]);

        $seller->update($data);

        return response()->json([
            'message' => 'Cập nhật cửa hàng thành công.',
            'seller'  => $seller->fresh(),
        ]);
    }
}
