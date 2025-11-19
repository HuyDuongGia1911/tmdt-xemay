<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

// import Model + Policy
use App\Models\Motorcycle;
use App\Policies\MotorcyclePolicy;
use App\Models\Inventory;
use App\Observers\MotorcycleObserver;
use App\Observers\InventoryObserver;
use App\Models\Review;
use App\Observers\ReviewObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // đăng ký policy cho Motorcycle
        Gate::policy(Motorcycle::class, MotorcyclePolicy::class);
        Motorcycle::observe(MotorcycleObserver::class);
        Inventory::observe(InventoryObserver::class);
        Review::observe(ReviewObserver::class);
    }
}
