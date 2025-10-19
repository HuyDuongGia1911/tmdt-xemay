@component('mail::message')
# Cảm ơn bạn đã đặt hàng!

Mã đơn: **{{ $order->code }}**
Khách hàng: **{{ $order->buyer->name }}** ({{ $order->buyer->email }})

@component('mail::table')
| Sản phẩm | SL | Giá | Tạm tính |
|:--|:--:|--:|--:|
@foreach ($order->items as $item)
| {{ $item->motorcycle->name }} | {{ $item->quantity }} | {{ number_format($item->price) }}₫ | {{ number_format($item->subtotal) }}₫ |
@endforeach
@endcomponent

Tổng cộng: **{{ number_format($order->total_amount) }}₫**

Cảm ơn bạn đã mua hàng tại {{ config('app.name') }}!
@endcomponent