<?php

namespace App\Observers;

use App\Models\Motorcycle;
use Illuminate\Support\Facades\Cache;

class MotorcycleObserver
{
    private function flushOne(Motorcycle $mc)
    {
        // Xóa cache chi tiết đúng ID
        Cache::tags(['motorcycle_detail'])->forget("motorcycles:detail:{$mc->id}");

        // Xóa cache catalog (danh sách) vì xe thay đổi ảnh hưởng list
        Cache::tags(['catalog'])->flush();
    }

    public function created(Motorcycle $mc)
    {
        $this->flushOne($mc);
    }

    public function updated(Motorcycle $mc)
    {
        $this->flushOne($mc);
    }

    public function deleted(Motorcycle $mc)
    {
        $this->flushOne($mc);
    }

    public function restored(Motorcycle $mc)
    {
        $this->flushOne($mc);
    }

    public function forceDeleted(Motorcycle $mc)
    {
        $this->flushOne($mc);
    }
}
