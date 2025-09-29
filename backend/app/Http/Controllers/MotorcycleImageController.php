<?php

namespace App\Http\Controllers;

use App\Models\Motorcycle;
use App\Models\MotorcycleImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MotorcycleImageController extends Controller
{
    // POST /api/motorcycles/{id}/images
    public function store(Request $request, $id)
    {
        $motorcycle = Motorcycle::findOrFail($id);

        // Kiểm tra quyền: admin hoặc đúng seller
        // $this->authorize('update', $motorcycle);

        $request->validate([
            'image' => 'required|image|max:2048', // max 2MB
        ]);

        $path = $request->file('image')->store('motorcycles', 'public');

        $image = $motorcycle->images()->create([
            'url' => '/storage/' . $path,
        ]);

        return response()->json($image, 201);
    }

    // DELETE /api/motorcycles/{id}/images/{imageId}
    public function destroy($id, $imageId)
    {
        $motorcycle = Motorcycle::findOrFail($id);
        // $this->authorize('update', $motorcycle);

        $image = $motorcycle->images()->findOrFail($imageId);

        // Xóa file khỏi disk
        Storage::disk('public')->delete(str_replace('/storage/', '', $image->url));

        $image->delete();

        return response()->json(['message' => 'Image deleted']);
    }
}
