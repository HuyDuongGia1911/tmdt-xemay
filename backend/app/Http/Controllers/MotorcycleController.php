<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMotorcycleRequest;
use App\Http\Requests\UpdateMotorcycleRequest;
use App\Models\Motorcycle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


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
    public function show(Motorcycle $motorcycle)
    {
        $motorcycle->load(['category', 'seller', 'spec', 'inventory', 'reviews']);

        $user = Auth::user();
        if ((!$user || $user->role === 'buyer') && $motorcycle->status !== 'active') {
            abort(404);
        }

        return response()->json($motorcycle);
    }

    // POST /api/motorcycles
    public function store(StoreMotorcycleRequest $request)
    {
        \Log::info('STORE MOTORCYCLE USER ROLE', ['role' => auth()->user()->role]);
        // $this->authorize('create', Motorcycle::class);

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
        // $this->authorize('update', $motorcycle);

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
        // $this->authorize('delete', $motorcycle);
        $motorcycle->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
