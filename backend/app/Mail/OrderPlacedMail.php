<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderPlacedMail extends Mailable
{
    use SerializesModels;

    public Order $order;

    public function __construct(Order $order)
    {
        $this->order = $order->load('buyer', 'items.motorcycle');
    }

    public function build()
    {
        return $this->subject('Xác nhận đơn hàng #' . $this->order->code)
            ->markdown('emails.orders.placed');
    }
}
