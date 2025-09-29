<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;

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
        $category->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
