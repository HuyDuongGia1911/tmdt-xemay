<?php

namespace App\Observers;

use App\Models\Motorcycle;
use Illuminate\Support\Facades\Cache;

class MotorcycleObserver
{
    private function flush()
    {
        Cache::tags(['motorcycles', 'catalog', 'featured', 'detail'])->flush();
    }
    public function created(Motorcycle $m)
    {
        $this->flush();
    }
    public function updated(Motorcycle $m)
    {
        $this->flush();
    }
    public function deleted(Motorcycle $m)
    {
        $this->flush();
    }
    public function restored(Motorcycle $m)
    {
        $this->flush();
    }
    public function forceDeleted(Motorcycle $m)
    {
        $this->flush();
    }
}
