<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMotorcycleRequest;
use App\Http\Requests\UpdateMotorcycleRequest;
use App\Models\Motorcycle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use App\Models\Spec;
use App\Models\Brand;
use App\Models\Color;

class MotorcycleController extends Controller
{
    // GET /api/motorcycles
    public function index(Request $request)
    {
        $q = Motorcycle::query()->with(['category', 'seller']);

        // filter cơ bản
        if ($brand = $request->get('brand')) {
            $q->where('brand', 'ILIKE', "%{$brand}%");
        }
        if ($condition = $request->get('condition')) {
            $q->where('condition', $condition);
        }
        if ($min = $request->get('min_price')) {
            $q->where('price', '>=', $min);
        }
        if ($max = $request->get('max_price')) {
            $q->where('price', '<=', $max);
        }
        if ($status = $request->get('status')) {
            $q->where('status', $status);
        }

        $user = Auth::user();
        if (!$user || $user->role === 'buyer') {
            $q->where('status', 'active');
        } elseif ($user->role === 'seller' && $request->boolean('mine')) {
            $q->where('seller_id', $user->id);
        }

        return response()->json($q->paginate(12));
    }

    // GET /api/motorcycles/{motorcycle:slug}
    // public function show(Motorcycle $motorcycle)
    // {
    //     $motorcycle->load(['category', 'seller', 'spec', 'inventory', 'reviews']);

    //     $user = Auth::user();
    //     if ((!$user || $user->role === 'buyer') && $motorcycle->status !== 'active') {
    //         abort(404);
    //     }

    //     return response()->json($motorcycle);
    // }
    // public function show(Motorcycle $motorcycle)
    // {
    //     // Buyer không được xem xe chưa active
    //     $user = Auth::user();
    //     if ((!$user || $user->role === 'buyer') && $motorcycle->status !== 'active') {
    //         abort(404);
    //     }

    //     // Tạo key cache theo slug + updated_at để nếu sửa xe thì cache tự hết hạn
    //     $slug = $motorcycle->slug;
    //     $updatedAt = optional($motorcycle->updated_at)->timestamp;
    //     $key = "motorcycles:detail:{$slug}:{$updatedAt}";

    //     $tags = ['motorcycles', 'detail'];
    //     $ttl = 3600; // 1 giờ

    //     $cache = Cache::tags($tags);
    //     $hit = $cache->has($key);

    //     $payload = $cache->remember($key, $ttl, function () use ($motorcycle) {
    //         $motorcycle->load(['category', 'seller', 'spec', 'inventory', 'reviews']);
    //         return $motorcycle->toArray();
    //     });

    //     // Ghi cờ để middleware CacheHitHeader tự thêm X-Cache
    //     app()->instance('cache.hit', $hit);

    //     return response()->json($payload);
    // }
    public function show(Motorcycle $motorcycle)
    {
        $user = Auth::user();
        if ((!$user || $user->role === 'buyer') && $motorcycle->status !== 'active') {
            abort(404);
        }

        // $cache = Cache::tags(['motorcycles', 'motorcycle_detail']);
        $cache = Cache::tags(['motorcycle_detail']);
        $key = "motorcycles:detail:{$motorcycle->id}";
        $ttl = 3600; // 1 giờ

        $hit = $cache->has($key);

        $payload = $cache->remember($key, $ttl, function () use ($motorcycle) {
            $motorcycle->load(['category', 'seller', 'spec', 'inventory', 'reviews',  'images']);
            return $motorcycle->toArray();
        });

        app()->instance('cache.hit', $hit);
        return response()->json($payload);
    }



    // POST /api/motorcycles
    // POST /api/motorcycles
    public function store(StoreMotorcycleRequest $request)
    {
        $this->authorize('create', Motorcycle::class);

        $data = $request->validated();

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $user = Auth::user();
        $data['seller_id'] = $user->seller->id;
        $data['status'] = $data['status'] ?? 'draft';

        // Lấy brand để set tên brand text (phục vụ filter cũ)
        $brand = Brand::findOrFail($data['brand_id']);
        $data['brand'] = $brand->name;

        // Lấy color (nếu có) để set text color (tuỳ chọn)
        $colorName = null;
        if (!empty($data['color_id'])) {
            $color = Color::find($data['color_id']);
            if ($color) {
                // bạn có thể dùng $color->name hoặc $color->code tuỳ ý
                $colorName = $color->name;
            }
        }

        // specData: dùng year + colorName (nếu có)
        $specData = [
            'engine_cc' => $data['engine_cc'] ?? null,
            'power_hp'  => $data['power_hp'] ?? null,
            'torque_nm' => $data['torque_nm'] ?? null,
            'weight_kg' => $data['weight_kg'] ?? null,
            'year'      => $data['year'] ?? null,
            'color'     => $colorName,
        ];

        // nếu bạn có cột color text trong motorcycles thì lưu thêm:
        if ($colorName !== null) {
            $data['color'] = $colorName;
        }

        // bỏ các field spec ra khỏi $data để tránh lỗi fillable
        unset(
            $data['engine_cc'],
            $data['power_hp'],
            $data['torque_nm'],
            $data['weight_kg']
        );

        $motorcycle = Motorcycle::create($data);

        $specData['motorcycle_id'] = $motorcycle->id;
        Spec::create($specData);

        return response()->json(
            $motorcycle->load(['category', 'seller', 'brand', 'color']),
            201
        );
    }


    // PUT /api/motorcycles/{motorcycle}
    // PUT /api/motorcycles/{motorcycle}
    public function update(UpdateMotorcycleRequest $request, Motorcycle $motorcycle)
    {
        $this->authorize('update', $motorcycle);

        $data = $request->validated();

        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        // brand_id -> brand name
        if (isset($data['brand_id'])) {
            $brand = Brand::findOrFail($data['brand_id']);
            $data['brand'] = $brand->name;
        }

        // color_id -> color name (text) cho backward-compat
        $colorName = null;
        if (array_key_exists('color_id', $data) && !empty($data['color_id'])) {
            $color = Color::find($data['color_id']);
            if ($color) {
                $colorName = $color->name;
            }
        }
        if ($colorName !== null) {
            $data['color'] = $colorName;
        }

        // spec data (nếu gửi kèm)
        $specData = [
            'engine_cc' => $data['engine_cc'] ?? null,
            'power_hp'  => $data['power_hp'] ?? null,
            'torque_nm' => $data['torque_nm'] ?? null,
            'weight_kg' => $data['weight_kg'] ?? null,
            'year'      => $data['year'] ?? null,
            'color'     => $colorName,
        ];

        unset(
            $data['engine_cc'],
            $data['power_hp'],
            $data['torque_nm'],
            $data['weight_kg']
        );

        $motorcycle->update($data);

        // update / tạo mới spec
        $spec = $motorcycle->spec;
        if ($spec) {
            $spec->update($specData);
        } else {
            $specData['motorcycle_id'] = $motorcycle->id;
            Spec::create($specData);
        }

        return response()->json(
            $motorcycle->load(['category', 'seller', 'brand', 'color', 'spec'])
        );
    }

    // DELETE /api/motorcycles/{motorcycle}
    public function destroy(Motorcycle $motorcycle)
    {
        $this->authorize('delete', $motorcycle);
        $motorcycle->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
