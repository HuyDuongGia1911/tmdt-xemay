<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentPaidMail extends Mailable
{
    use SerializesModels;

    public Order $order;

    public function __construct(Order $order)
    {
        $this->order = $order->load('buyer', 'items.motorcycle', 'payment');
    }

    public function build()
    {
        return $this->subject('Thanh toán thành công cho đơn #' . $this->order->code)
            ->markdown('emails.payments.paid');
    }
}
