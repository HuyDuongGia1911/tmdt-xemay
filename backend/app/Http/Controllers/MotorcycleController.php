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
    public function show(Motorcycle $motorcycle)
    {
        // Buyer không được xem xe chưa active
        $user = Auth::user();
        if ((!$user || $user->role === 'buyer') && $motorcycle->status !== 'active') {
            abort(404);
        }

        // Tạo key cache theo slug + updated_at để nếu sửa xe thì cache tự hết hạn
        $slug = $motorcycle->slug;
        $updatedAt = optional($motorcycle->updated_at)->timestamp;
        $key = "motorcycles:detail:{$slug}:{$updatedAt}";

        $tags = ['motorcycles', 'detail'];
        $ttl = 3600; // 1 giờ

        $cache = Cache::tags($tags);
        $hit = $cache->has($key);

        $payload = $cache->remember($key, $ttl, function () use ($motorcycle) {
            $motorcycle->load(['category', 'seller', 'spec', 'inventory', 'reviews']);
            return $motorcycle->toArray();
        });

        // Ghi cờ để middleware CacheHitHeader tự thêm X-Cache
        app()->instance('cache.hit', $hit);

        return response()->json($payload);
    }


    // POST /api/motorcycles
    public function store(StoreMotorcycleRequest $request)
    {

        $this->authorize('create', Motorcycle::class);

        $data = $request->validated();

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $data['seller_id'] = Auth::user()->seller->id;
        $data['status'] = $data['status'] ?? 'draft';

        $motorcycle = Motorcycle::create($data);

        return response()->json($motorcycle->load(['category', 'seller']), 201);
    }

    // PUT /api/motorcycles/{motorcycle}
    public function update(UpdateMotorcycleRequest $request, Motorcycle $motorcycle)
    {
        $this->authorize('update', $motorcycle);

        $data = $request->validated();

        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $motorcycle->update($data);

        return response()->json($motorcycle->load(['category', 'seller']));
    }

    // DELETE /api/motorcycles/{motorcycle}
    public function destroy(Motorcycle $motorcycle)
    {
        $this->authorize('delete', $motorcycle);
        $motorcycle->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
