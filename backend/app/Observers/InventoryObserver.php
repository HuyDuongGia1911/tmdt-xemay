<?php

namespace App\Observers;

use App\Models\Inventory;
use Illuminate\Support\Facades\Cache;

class InventoryObserver
{
    public function saved(Inventory $inv)
    {
        // Xoá cache chi tiết của đúng chiếc xe khi tồn kho thay đổi
        Cache::tags(['motorcycle_detail'])->forget("motorcycles:detail:{$inv->motorcycle_id}");
    }
}
