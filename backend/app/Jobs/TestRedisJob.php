<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class TestRedisJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [10, 30, 60];

    public function handle(): void
    {
        Log::info('🧩 TestRedisJob bắt đầu chạy trong hàng đợi Redis...');

        Mail::raw('Đây là email test gửi qua Redis queue!', function ($msg) {
            $msg->to('test@example.com')->subject('✅ Queue Redis hoạt động!');
        });

        Log::info('✅ Đã gửi mail test xong!');
    }
}
