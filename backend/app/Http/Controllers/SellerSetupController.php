<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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
    // POST /api/seller/profile/logo-upload
    public function uploadLogo(Request $request)
    {
        $seller = auth()->user()->seller;
        if (!$seller) {
            return response()->json(['message' => 'Seller not found'], 404);
        }

        $request->validate([
            'logo' => 'required|image|max:2048'
        ]);

        // 1) Lưu logo cũ
        $old = $seller->logo_url;

        // 2) Upload file mới
        $path = $request->file('logo')->store('sellers', 'public');
        $url = env('APP_URL') . '/storage/' . $path;

        $seller->logo_url = $url;
        $seller->save();

        // 3) Xóa logo cũ nếu là file local
        if ($old && str_contains($old, '/storage/')) {
            $oldPath = str_replace(env('APP_URL') . '/storage/', '', $old);
            Storage::disk('public')->delete($oldPath);
        }

        return response()->json([
            'message' => 'Logo uploaded',
            'logo_url' => $url
        ]);
    }

    // POST /api/seller/profile/logo-url
    public function setLogoUrl(Request $request)
    {
        $seller = auth()->user()->seller;
        if (!$seller) {
            return response()->json(['message' => 'Seller not found'], 404);
        }

        $request->validate([
            'url' => 'required|url'
        ]);

        $old = $seller->logo_url;

        $seller->logo_url = $request->url;
        $seller->save();

        if ($old && str_contains($old, '/storage/')) {
            $oldPath = str_replace(env('APP_URL') . '/storage/', '', $old);
            Storage::disk('public')->delete($oldPath);
        }

        return response()->json([
            'message' => 'Logo updated',
            'logo_url' => $seller->logo_url
        ]);
    }

    // DELETE /api/seller/profile/logo
    public function deleteLogo()
    {
        $seller = auth()->user()->seller;
        if (!$seller) {
            return response()->json(['message' => 'Seller not found'], 404);
        }

        $old = $seller->logo_url;
        $seller->logo_url = null;
        $seller->save();

        if ($old && str_contains($old, '/storage/')) {
            $oldPath = str_replace(env('APP_URL') . '/storage/', '', $old);
            Storage::disk('public')->delete($oldPath);
        }

        return response()->json(['message' => 'Logo removed']);
    }
}
