<?php

namespace App\Services\Payments;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;


class MomoService implements PaymentService
{
    protected array $cfg;

    public function __construct()
    {
        $this->cfg = config('payments.momo');
    }

    /**
     * Khởi tạo giao dịch với MoMo
     */
    public function init(Order $order): array
    {
        // Nếu chưa có Payment record thì tạo mới
        $payment = $order->payment;
        if (!$payment) {
            $payment = Payment::create([
                'order_id' => $order->id,
                'provider' => 'momo',
                'amount'   => $order->total_amount,
                'currency' => 'VND',
                'tx_id'    => 'MOMO-' . $order->id . '-' . Str::uuid()->toString(),
                'status'   => 'pending',
            ]);
        }

        // Build payload (theo doc MoMo v3)
        $payload = [
            'partnerCode' => $this->cfg['partner_code'],
            'requestId'   => (string) Str::uuid(),
            'amount'      => (string) $order->total_amount,
            'orderId'     => (string) $payment->tx_id,
            'orderInfo'   => 'Thanh toán cho hóa đơn #' . $order->code,
            'redirectUrl' => $this->cfg['redirect_url'],
            'ipnUrl'      => $this->cfg['ipn_url'],
            'extraData'   => '',
            'requestType' => 'captureWallet',

        ];
        // Build raw string để ký HMAC
        $raw = "accessKey={$this->cfg['access_key']}"
            . "&amount={$payload['amount']}"
            . "&extraData={$payload['extraData']}"
            . "&ipnUrl={$payload['ipnUrl']}"
            . "&orderId={$payload['orderId']}"
            . "&orderInfo={$payload['orderInfo']}"
            . "&partnerCode={$payload['partnerCode']}"
            . "&redirectUrl={$payload['redirectUrl']}"
            . "&requestId={$payload['requestId']}"
            . "&requestType={$payload['requestType']}";

        $payload['signature'] = hash_hmac('sha256', $raw, $this->cfg['secret_key']);

        // === Thêm log để so sánh với MoMo ===
        \Log::info('MOMO RAW STRING', ['raw' => $raw]);
        \Log::info('MOMO SIGNATURE LOCAL', ['sig' => $payload['signature']]);
        \Log::info('MOMO KEYS', [
            'partnerCode' => $this->cfg['partner_code'],
            'accessKey'   => $this->cfg['access_key'],
            'secretKey'   => substr($this->cfg['secret_key'], 0, 5) . '...'
        ]);


        // Gọi MoMo API
        $res = Http::asJson()->post($this->cfg['endpoint']['create'], $payload);
        $data = $res->json();

        // Lưu response để debug
        $payment->raw_payload = ['request' => $payload, 'response' => $data];
        $payment->pay_url = $data['payUrl'] ?? null;
        $payment->gateway_txn_id = $data['transId'] ?? null;
        $payment->save();

        return [
            'pay_url' => $payment->pay_url,
            'payment' => $payment,
        ];
    }

    /**
     * Xử lý callback IPN từ MoMo
     */
    public function handleIpn(Request $request): array
    {
        $payload = $request->all();

        // Build raw string verify signature (theo doc MoMo v3)
        $raw = "accessKey={$this->cfg['access_key']}"
            . "&amount={$payload['amount']}"
            . "&extraData={$payload['extraData']}"
            . "&message={$payload['message']}"
            . "&orderId={$payload['orderId']}"
            . "&orderInfo={$payload['orderInfo']}"
            . "&orderType={$payload['orderType']}"
            . "&partnerCode={$payload['partnerCode']}"
            . "&payType={$payload['payType']}"
            . "&requestId={$payload['requestId']}"
            . "&responseTime={$payload['responseTime']}"
            . "&resultCode={$payload['resultCode']}"
            . "&transId={$payload['transId']}";

        $calcSig = hash_hmac('sha256', $raw, $this->cfg['secret_key']);
        if (($payload['signature'] ?? '') !== $calcSig) {
            return ['ok' => false, 'message' => 'Invalid signature'];
        }

        // Tìm Payment record
        $payment = Payment::where('tx_id', $payload['orderId'] ?? '')->first();
        if (!$payment) {
            return ['ok' => false, 'message' => 'Payment not found'];
        }

        // So khớp amount
        if ((int)$payment->amount !== (int)($payload['amount'] ?? 0)) {
            return ['ok' => false, 'message' => 'Amount mismatched'];
        }

        // Cập nhật trạng thái an toàn
        DB::transaction(function () use ($payment, $payload) {
            $payment->refresh();
            if ($payment->status === 'paid') {
                return; // đã xử lý rồi
            }

            if ((string) $payload['resultCode'] === '0') {
                // Thành công
                $payment->status = 'paid';
                $payment->gateway_txn_id = $payload['transId'] ?? $payment->gateway_txn_id;
                $payment->raw_payload = array_merge($payment->raw_payload ?? [], ['ipn' => $payload]);
                $payment->save();

                $order = $payment->order()->lockForUpdate()->first();
                $order->payment_status = 'paid';
                if ($order->status === 'pending') {
                    $order->status = 'confirmed';
                }
                $order->paid_at = now();
                $order->save();
            } else {
                // Thất bại
                $payment->status = 'failed';
                $payment->raw_payload = array_merge($payment->raw_payload ?? [], ['ipn' => $payload]);
                $payment->save();

                $order = $payment->order()->lockForUpdate()->first();
                $order->payment_status = 'failed';
                $order->save();
            }
        });

        return ['ok' => true, 'message' => 'IPN processed'];
    }

    /**
     * Xử lý trang redirect (returnUrl)
     */
    public function parseReturn(Request $request): array
    {
        return [
            'tx_id'      => $request->get('orderId'),
            'message'    => $request->get('message'),
            'resultCode' => $request->get('resultCode'),
        ];
    }
}
