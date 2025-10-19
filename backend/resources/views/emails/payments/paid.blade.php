@component('mail::message')
# Thanh toán thành công 🎉

Đơn hàng **#{{ $order->code }}** đã được thanh toán.

**Phương thức:** {{ $order->payment->method }}
**Số tiền:** {{ number_format($order->payment->amount) }}₫
**Mã giao dịch:** {{ $order->payment->transaction_id }}

@component('mail::button', ['url' => config('app.url').'/orders/'.$order->code])
Xem đơn hàng
@endcomponent

Cảm ơn bạn đã mua sắm tại {{ config('app.name') }}!
@endcomponent