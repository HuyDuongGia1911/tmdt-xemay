<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class BrandController extends Controller
{
    // GET /brands (public)
    // GET /brands (public)
    public function index()
    {
        $cacheKey = "brands:index:v1";

        $hit = Cache::tags(['brands'])->has($cacheKey);

        $brands = Cache::tags(['brands'])->remember($cacheKey, 3600, function () {
            return Brand::orderBy('name')->get();
        });

        return response()
            ->json($brands)
            ->header('X-Cache', $hit ? 'HIT' : 'MISS')
            ->header('X-Cache-Store', config('cache.default'));
    }


    // GET /admin/brands/{id}
    public function show($id)
    {
        return response()->json(
            Brand::findOrFail($id)
        );
    }

    // POST /admin/brands
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string',
            'logo_url' => 'nullable|string'
        ]);

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        // slug unique
        $base = $data['slug'];
        $i = 1;
        while (Brand::where('slug', $data['slug'])->exists()) {
            $data['slug'] = $base . '-' . ($i++);
        }

        $brand = Brand::create($data);

        return response()->json($brand, 201);
    }

    // PUT /admin/brands/{id}
    public function update(Request $request, $id)
    {
        $brand = Brand::findOrFail($id);

        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'slug' => 'nullable|string',
            'logo_url' => 'nullable|string'
        ]);

        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        if (!empty($data['slug'])) {
            $base = $data['slug'];
            $i = 1;
            while (Brand::where('slug', $data['slug'])->where('id', '!=', $brand->id)->exists()) {
                $data['slug'] = $base . '-' . ($i++);
            }
        }

        $brand->update($data);

        return response()->json($brand);
    }

    // DELETE /admin/brands/{id}
    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);

        // XÓA FILE LOGO nếu là file local
        if ($brand->logo_url && str_contains($brand->logo_url, '/storage/')) {
            $oldPath = str_replace(env('APP_URL') . '/storage/', '', $brand->logo_url);
            Storage::disk('public')->delete($oldPath);
        }

        $brand->delete();

        return response()->json(['message' => 'Deleted']);
    }


    // POST /admin/brands/{id}/logo-upload
    public function uploadLogo(Request $request, $id)
    {
        $brand = Brand::findOrFail($id);

        $request->validate([
            'logo' => 'required|image|max:2048'
        ]);

        // XÓA FILE CŨ (nếu là file local)
        if ($brand->logo_url && str_contains($brand->logo_url, '/storage/')) {
            $oldPath = str_replace(env('APP_URL') . '/storage/', '', $brand->logo_url);
            Storage::disk('public')->delete($oldPath);
        }

        // UPLOAD FILE MỚI
        $path = $request->file('logo')->store('brands', 'public');
        $url = env('APP_URL') . '/storage/' . $path;

        $brand->logo_url = $url;
        $brand->save();

        return response()->json([
            'message' => 'Logo uploaded',
            'logo_url' => $url
        ]);
    }


    // POST /admin/brands/{id}/logo-url
    public function setLogoUrl(Request $request, $id)
    {
        $brand = Brand::findOrFail($id);

        $request->validate(['url' => 'required|url']);

        // XÓA FILE CŨ nếu là file local
        if ($brand->logo_url && str_contains($brand->logo_url, '/storage/')) {
            $oldPath = str_replace(env('APP_URL') . '/storage/', '', $brand->logo_url);
            Storage::disk('public')->delete($oldPath);
        }

        // Set URL mới
        $brand->logo_url = $request->url;
        $brand->save();

        return response()->json([
            'message' => 'Logo URL updated',
            'logo_url' => $brand->logo_url
        ]);
    }
}
