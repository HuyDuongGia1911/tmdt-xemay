<?php

namespace App\Services\Payments;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VnpayService implements PaymentService
{
    protected array $cfg;

    public function __construct()
    {
        $this->cfg = config('payments.vnpay');
    }

    protected function hashAllFields(array $input): string
    {
        ksort($input);
        $query = [];
        foreach ($input as $key => $val) {
            if ($val !== null && $val !== '') {
                $query[] = $key . '=' . urlencode($val);
            }
        }
        $raw = implode('&', $query);
        return hash_hmac('sha512', $raw, $this->cfg['hash_secret']);
    }

    public function init(Order $order): array
    {
        // Tạo payment nếu chưa có
        $payment = $order->payment;
        if (!$payment) {
            $payment = Payment::create([
                'order_id' => $order->id,
                'provider' => 'vnpay',
                'amount'   => $order->total_amount,
                'currency' => 'VND',
                'tx_id'    => 'VNP-' . $order->id . '-' . Str::uuid()->toString(),
                'status'   => 'pending',
            ]);
        }

        $params = [
            'vnp_Version'    => '2.1.0',
            'vnp_Command'    => 'pay',
            'vnp_TmnCode'    => $this->cfg['tmn_code'],
            'vnp_Amount'     => $order->total_amount * 100, // x100 theo chuẩn VNPAY
            'vnp_CurrCode'   => 'VND',
            'vnp_TxnRef'     => $payment->tx_id,            // mã giao dịch của ta
            'vnp_OrderInfo'  => 'Payment for order #' . $order->code,
            'vnp_OrderType'  => 'other',
            'vnp_Locale'     => 'vn',
            'vnp_ReturnUrl'  => $this->cfg['return_url'],
            'vnp_IpAddr'     => request()->ip(),
            'vnp_CreateDate' => now()->format('YmdHis'),
        ];

        $hash = $this->hashAllFields($params);
        $params['vnp_SecureHash'] = $hash;
        $query = http_build_query($params);
        $payUrl = $this->cfg['endpoint'] . '?' . $query;

        // Lưu
        $payment->pay_url = $payUrl;
        $payment->save();

        return [
            'pay_url' => $payUrl,
            'payment' => $payment,
        ];
    }

    public function handleIpn(Request $request): array
    {
        $data = $request->all();

        // Lấy SecureHash từ query và loại bỏ trước khi hash lại
        $hashServer = $data['vnp_SecureHash'] ?? '';
        unset($data['vnp_SecureHash'], $data['vnp_SecureHashType']);

        $calcHash = $this->hashAllFields($data);
        if (strtolower($hashServer) !== strtolower($calcHash)) {
            return ['ok' => false, 'message' => 'Invalid signature'];
        }

        // Tìm payment theo vnp_TxnRef (tx_id của ta)
        $payment = Payment::where('tx_id', $data['vnp_TxnRef'] ?? '')->first();
        if (!$payment) {
            return ['ok' => false, 'message' => 'Payment not found'];
        }

        // Kiểm số tiền
        $amount = (int) (($data['vnp_Amount'] ?? 0) / 100);
        if ((int)$payment->amount !== $amount) {
            return ['ok' => false, 'message' => 'Amount mismatched'];
        }

        DB::transaction(function () use ($payment, $data) {
            $payment->refresh();
            if ($payment->status === 'paid') {
                return;
            }

            $resp = (string) ($data['vnp_ResponseCode'] ?? '99');
            if ($resp === '00') {
                $payment->status = 'paid';
                $payment->gateway_txn_id = $data['vnp_TransactionNo'] ?? $payment->gateway_txn_id;
                $payment->raw_payload = array_merge($payment->raw_payload ?? [], ['ipn' => $data]);
                $payment->save();

                $order = $payment->order()->lockForUpdate()->first();
                $order->payment_status = 'paid';
                $order->status = $order->status === 'pending' ? 'confirmed' : $order->status;
                $order->paid_at = now();
                $order->save();
            } else {
                $payment->status = 'failed';
                $payment->raw_payload = array_merge($payment->raw_payload ?? [], ['ipn' => $data]);
                $payment->save();

                $order = $payment->order()->lockForUpdate()->first();
                $order->payment_status = 'failed';
                $order->save();
            }
        });

        return ['ok' => true, 'message' => 'IPN processed'];
    }

    public function parseReturn(Request $request): array
    {
        return [
            'vnp_TxnRef'       => $request->get('vnp_TxnRef'),
            'vnp_ResponseCode' => $request->get('vnp_ResponseCode'),
            'vnp_TransactionNo' => $request->get('vnp_TransactionNo'),
        ];
    }
}
