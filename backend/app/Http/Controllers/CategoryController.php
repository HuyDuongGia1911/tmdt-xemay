<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Category;

class CategoryController extends Controller
{
    // GET /api/categories?page=1&per_page=10
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 12);
        $q = Category::query()->orderBy('name');

        if ($search = $request->get('search')) {
            $q->where('name', 'ILIKE', "%{$search}%");
        }

        return response()->json($q->paginate($perPage));
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
