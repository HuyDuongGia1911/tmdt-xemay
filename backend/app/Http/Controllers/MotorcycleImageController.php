<?php

namespace App\Http\Controllers;

use App\Models\Motorcycle;
use App\Models\MotorcycleImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class MotorcycleImageController extends Controller
{
    // GET /api/motorcycles/{id}/images
    public function index($id)
    {
        $motorcycle = Motorcycle::with('images')->findOrFail($id);

        // Kiểm tra quyền: admin hoặc đúng seller
        $this->authorize('update', $motorcycle);

        return response()->json([
            'motorcycle_id' => $motorcycle->id,
            'thumbnail_url' => $motorcycle->thumbnail_url,
            'images' => $motorcycle->images,
        ]);
    }

    // POST /api/motorcycles/{id}/images
    public function store(Request $request, $id)
    {
        $motorcycle = Motorcycle::findOrFail($id);

        // Kiểm tra quyền: admin hoặc đúng seller
        $this->authorize('update', $motorcycle);

        $request->validate([
            'image' => 'required|image|max:2048', // max 2MB
        ]);

        $path = $request->file('image')->store('motorcycles', 'public');

        // URL tuyệt đối — quan trọng nhất
        $url = env('APP_URL') . '/storage/' . $path;

        $image = $motorcycle->images()->create([
            'url' => $url,
        ]);

        // nếu thumbnail chưa có – set luôn
        if (!$motorcycle->getRawOriginal('thumbnail_url')) {
            $motorcycle->thumbnail_url = $url;
            $motorcycle->save();
        }
        Cache::tags(['motorcycle_detail'])->forget("motorcycles:detail:{$motorcycle->id}");
        Cache::tags(['motorcycles', 'catalog', 'featured'])->flush();  // <— thêm
        return response()->json($image, 201);
    }

    // PATCH /api/motorcycles/{id}/images/{imageId}/thumbnail
    public function setThumbnail($id, $imageId)
    {
        $motorcycle = Motorcycle::findOrFail($id);
        $this->authorize('update', $motorcycle);

        $image = $motorcycle->images()->findOrFail($imageId);

        $motorcycle->thumbnail_url = $image->url;
        $motorcycle->save();
        // flush cache catalog
        Cache::tags(['motorcycles', 'catalog', 'featured'])->flush();
        return response()->json([
            'message' => 'Thumbnail updated',
            'thumbnail_url' => $motorcycle->thumbnail_url,
        ]);
    }

    // DELETE /api/motorcycles/{id}/images/{imageId}
    public function destroy($id, $imageId)
    {
        $motorcycle = Motorcycle::findOrFail($id);
        $this->authorize('update', $motorcycle);

        $image = $motorcycle->images()->findOrFail($imageId);

        // Xoá thumbnail nếu cần
        if ($motorcycle->thumbnail_url === $image->url) {
            $motorcycle->thumbnail_url = null;
            $motorcycle->save();
        }

        // Chuyển URL tuyệt đối -> path tương đối
        $relativePath = $image->url;
        $relativePath = str_replace(env('APP_URL') . '/storage/', '', $relativePath);
        $relativePath = str_replace('/storage/', '', $relativePath);

        // Xóa file trong storage/app/public
        Storage::disk('public')->delete($relativePath);

        $image->delete();

        Cache::tags(['motorcycle_detail'])->forget("motorcycles:detail:{$motorcycle->id}");
        Cache::tags(['motorcycles', 'catalog', 'featured'])->flush();  // <— thêm
        return response()->json(['message' => 'Image deleted']);
    }
    public function storeFromLink(Request $request, $id)
    {
        $motorcycle = Motorcycle::findOrFail($id);
        $this->authorize('update', $motorcycle);

        $request->validate([
            'url' => 'required|url'
        ]);

        $image = $motorcycle->images()->create([
            'url' => $request->url, // URL tuyệt đối
        ]);

        // Nếu chưa có thumbnail thì auto set
        if (empty($motorcycle->thumbnail_url)) {
            $motorcycle->thumbnail_url = $image->url;
            $motorcycle->save();
        }
        Cache::tags(['motorcycle_detail'])->forget("motorcycles:detail:{$motorcycle->id}");
        Cache::tags(['motorcycles', 'catalog', 'featured'])->flush();  // <— thêm
        return response()->json($image, 201);
    }
}
