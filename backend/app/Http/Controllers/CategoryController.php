<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    // GET /api/categories?page=1&per_page=10


    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 12);
        $search  = $request->get('search');

        // tạo key cache động (per_page + search) để tránh đè lẫn
        $cacheKey = "categories:index:v1:perpage={$perPage}:search=" . ($search ?? 'none');

        // check xem cache đã có chưa
        $hit = Cache::tags(['categories'])->has($cacheKey);

        $categories = Cache::tags(['categories'])->remember($cacheKey, 3600, function () use ($perPage, $search) {
            $q = Category::query()->orderBy('name');

            if ($search) {
                $q->where('name', 'ILIKE', "%{$search}%");
            }

            // convert paginator thành array để Redis dễ lưu
            return $q->paginate($perPage)->toArray();
        });

        return response()
            ->json($categories)
            ->header('X-Cache', $hit ? 'HIT' : 'MISS')
            ->header('X-Cache-Store', config('cache.default'));
    }



    // GET /api/categories/{id}
    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    // POST /api/categories
    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();

        // Tự sinh slug nếu không truyền
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        // Nếu slug trùng, thêm hậu tố
        $base = $data['slug'];
        $i = 1;
        while (Category::where('slug', $data['slug'])->exists()) {
            $data['slug'] = $base . '-' . ($i++);
        }

        $category = Category::create($data);

        return response()->json($category, 201);
    }

    // PUT /api/categories/{id}
    public function update(UpdateCategoryRequest $request, $id)
    {
        $category = Category::findOrFail($id);
        $data = $request->validated();

        if (isset($data['name']) && empty($data['slug'])) {
            // Nếu đổi name mà không truyền slug mới -> sinh lại
            $data['slug'] = Str::slug($data['name']);
        }

        if (!empty($data['slug'])) {
            $base = $data['slug'];
            $i = 1;
            while (Category::where('slug', $data['slug'])->where('id', '!=', $category->id)->exists()) {
                $data['slug'] = $base . '-' . ($i++);
            }
        }

        $category->update($data);

        return response()->json($category);
    }

    // DELETE /api/categories/{id}
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        // XÓA FILE ICON nếu là file local
        if ($category->icon_url && str_contains($category->icon_url, '/storage/')) {
            $oldPath = str_replace(env('APP_URL') . '/storage/', '', $category->icon_url);
            Storage::disk('public')->delete($oldPath);
        }

        $category->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // POST /admin/categories/{id}/icon-upload
    public function uploadIcon(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'icon' => 'required|image|max:2048'
        ]);

        // 1) LƯU ICON CŨ TRƯỚC KHI UPDATE
        $oldIcon = $category->icon_url;

        // 2) UPLOAD ICON MỚI
        $path = $request->file('icon')->store('categories', 'public');
        $url = env('APP_URL') . '/storage/' . $path;

        $category->icon_url = $url;
        $category->save();

        // 3) XÓA FILE CŨ
        if ($oldIcon && str_contains($oldIcon, '/storage/')) {
            $oldPath = str_replace(env('APP_URL') . '/storage/', '', $oldIcon);
            Storage::disk('public')->delete($oldPath);
        }

        return response()->json([
            'message' => 'Icon uploaded',
            'icon_url' => $url
        ]);
    }

    // POST /admin/categories/{id}/icon-url
    public function setIconUrl(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'url' => 'required|url'
        ]);

        // 1) LƯU ICON CŨ TRƯỚC KHI SET URL MỚI
        $oldIcon = $category->icon_url;

        // 2) UPDATE URL
        $category->icon_url = $request->url;
        $category->save();

        // 3) XÓA FILE CŨ (nếu là local)
        if ($oldIcon && str_contains($oldIcon, '/storage/')) {
            $oldPath = str_replace(env('APP_URL') . '/storage/', '', $oldIcon);
            Storage::disk('public')->delete($oldPath);
        }

        return response()->json([
            'message' => 'Icon URL updated',
            'icon_url' => $category->icon_url
        ]);
    }
}
