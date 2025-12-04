<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MotorcycleIndexRequest;
use App\Http\Resources\MotorcycleResource;
use App\Models\Motorcycle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class MotorcycleCatalogController extends Controller
{
    // GET /api/motorcycles (list + filter nâng cao + phân trang)
    // public function index(MotorcycleIndexRequest $request)
    // {
    //     $filters = $request->validatedFilters();

    //     $query = Motorcycle::query()
    //         ->with(['category:id,name', 'seller:id,shop_name', 'inventory:id,motorcycle_id,stock'])
    //         ->select(['id', 'slug', 'name', 'brand', 'price', 'year', 'condition', 'color', 'type', 'average_rating', 'category_id', 'seller_id', 'created_at'])
    //         ->applyFilters($filters);

    //     $paginator = $query->paginate(
    //         perPage: $filters['per_page'],
    //         page: $filters['page']
    //     );

    //     return MotorcycleResource::collection($paginator)
    //         ->additional([
    //             'meta' => [
    //                 'current_page' => $paginator->currentPage(),
    //                 'per_page' => $paginator->perPage(),
    //                 'last_page' => $paginator->lastPage(),
    //                 'total' => $paginator->total(),
    //             ]
    //         ]);
    // }
    public function index(MotorcycleIndexRequest $request)
    {
        $filters = $request->validatedFilters();

        // 1) Tạo cache key ổn định từ filters (sort key) + page/per_page
        $keyParts = array_filter($filters, fn($v) => $v !== null && $v !== '');
        ksort($keyParts);
        $page    = (int)($keyParts['page']     ?? 1);
        $perPage = (int)($keyParts['per_page'] ?? 12);

        $cacheKey = 'motorcycles:index:' . md5(http_build_query($keyParts) . ":p={$page}:pp={$perPage}");
        $ttlSeconds = 3600; // 1 giờ
        $tags = ['motorcycles', 'catalog'];

        // 2) HIT/MISS và lấy/ghi cache
        $cache = Cache::tags($tags);
        $hit = $cache->has($cacheKey);

        $payload = $cache->remember($cacheKey, $ttlSeconds, function () use ($filters, $page, $perPage) {

            $sort = $filters['sort'] ?? null;

            // base query
            $query = Motorcycle::query()
                ->with(['category:id,name', 'seller:id,shop_name', 'inventory:id,motorcycle_id,stock'])
                ->applyFilters($filters);

            // --- select mặc định (không join order_items) ---
            $baseSelect = [
                'motorcycles.id',
                'motorcycles.slug',
                'motorcycles.name',

                'motorcycles.price',
                'motorcycles.year',
                'motorcycles.condition',
                'motorcycles.color_id',
                'motorcycles.type',
                'motorcycles.average_rating',
                'motorcycles.category_id',
                'motorcycles.seller_id',
                'motorcycles.created_at',
                'motorcycles.thumbnail_url',
                'motorcycles.description',
            ];

            // Xử lý sort
            switch ($sort) {
                case 'name_asc':
                    $query->select($baseSelect)->orderBy('motorcycles.name', 'asc');
                    break;

                case 'name_desc':
                    $query->select($baseSelect)->orderBy('motorcycles.name', 'desc');
                    break;

                case 'price_asc':
                    $query->select($baseSelect)->orderBy('motorcycles.price', 'asc');
                    break;

                case 'price_desc':
                    $query->select($baseSelect)->orderBy('motorcycles.price', 'desc');
                    break;

                case 'oldest':
                    $query->select($baseSelect)->orderBy('motorcycles.created_at', 'asc');
                    break;

                case 'newest':
                    $query->select($baseSelect)->orderBy('motorcycles.created_at', 'desc');
                    break;

                case 'best_selling':
                    $salesSub = DB::table('order_items')
                        ->selectRaw('motorcycle_id, SUM(quantity) as total_sold')
                        ->groupBy('motorcycle_id');

                    $query
                        ->leftJoinSub($salesSub, 'sales', function ($join) {
                            $join->on('motorcycles.id', '=', 'sales.motorcycle_id');
                        })
                        ->select(array_merge($baseSelect, [
                            DB::raw('COALESCE(sales.total_sold, 0) AS total_sold')
                        ]))
                        ->orderByDesc('total_sold')
                        ->orderByDesc('motorcycles.created_at');
                    break;


                case 'featured':
                default:
                    // featured = mặc định: xe mới nhất
                    $query->select($baseSelect)->orderBy('motorcycles.created_at', 'desc');
                    break;
            }

            $paginator = $query->paginate(perPage: $perPage, page: $page);

            // Lấy payload chuẩn (data + links + meta) từ Resource collection:
            $resource = MotorcycleResource::collection($paginator);
            $array = $resource->response()->getData(true); // mảng thuần

            return $array; // gồm: data[], links{}, meta{current_page, per_page, ...}
        });

        // 3) Trả JSON + header X-Cache
        return response()->json($payload)->header('X-Cache', $hit ? 'HIT' : 'MISS');
    }


    // GET /api/motorcycles/featured (sản phẩm nổi bật, cache Redis)
    public function featured(Request $request)
    {
        $limit = (int)($request->get('limit', 8));
        $sort = $request->get('sort', 'latest');

        $cacheKey = "motorcycles:featured:sort={$sort}:limit={$limit}";
        $ttl = 3600;

        $hit = Cache::tags(['motorcycles', 'featured'])->has($cacheKey);

        $items = Cache::tags(['motorcycles', 'featured'])->remember($cacheKey, $ttl, function () use ($limit, $sort) {
            $q = Motorcycle::query()
                ->with([
                    'category:id,name',
                    'seller:id,shop_name',
                    'images',
                    'brand:id,name',
                    'color:id,name,code'
                ])
                ->select([
                    'id',
                    'slug',
                    'name',
                    'brand_id',
                    'price',
                    'year',
                    'condition',
                    'color_id',

                    'average_rating',
                    'category_id',
                    'seller_id',
                    'created_at',
                    'thumbnail_url'
                ])
                ->active();


            $q = match ($sort) {
                'price_asc' => $q->orderBy('price', 'asc'),
                'price_desc' => $q->orderBy('price', 'desc'),
                default => $q->orderBy('created_at', 'desc'),
            };

            return $q->limit($limit)->get();
        });

        return MotorcycleResource::collection($items)
            ->response()
            ->header('X-Cache', $hit ? 'HIT' : 'MISS');
    }
}
