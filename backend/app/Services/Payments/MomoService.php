<?php

namespace App\Services\Payments;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use App\Jobs\SendPaymentPaidMail;
use Illuminate\Support\Facades\Log;

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
            'extraData' => (string) $order->id,
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
        Log::channel('payments')->info('momo_init_build', [
            'raw' => $raw,
            'signature' => $payload['signature'],
            'partnerCode' => $this->cfg['partner_code'],
            'accessKey'   => $this->cfg['access_key'],
            // Không log full secret key
        ]);



        // Gọi MoMo API
        $res = Http::asJson()->post($this->cfg['endpoint']['create'], $payload);
        $data = $res->json();
        Log::channel('payments')->info('momo_init_response', [
            'tx_id'   => $payment->tx_id,
            'status'  => $res->status(),
            'body'    => $data,
        ]);
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

        // 1) Log IPN ngay khi nhận
        Log::channel('payments')->info('momo_ipn_received', [
            'payload' => $payload,
        ]);

        // 2) Verify signature (theo doc MoMo v3)
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

        Log::channel('payments')->info('momo_ipn_signature_check', [
            'calc'   => $calcSig,
            'remote' => $payload['signature'] ?? null,
        ]);

        if (($payload['signature'] ?? '') !== $calcSig) {
            Log::channel('payments')->warning('momo_ipn_rejected_signature', [
                'payload' => $payload,
            ]);
            return ['ok' => false, 'message' => 'Invalid signature'];
        }

        // 3) Tìm Payment record theo tx_id
        $payment = Payment::where('tx_id', $payload['orderId'] ?? '')->first();
        if (!$payment) {
            Log::channel('payments')->warning('momo_ipn_payment_not_found', [
                'orderId' => $payload['orderId'] ?? null
            ]);
            return ['ok' => false, 'message' => 'Payment not found'];
        }

        // 4) So khớp amount
        if ((int)$payment->amount !== (int)($payload['amount'] ?? 0)) {
            Log::channel('payments')->warning('momo_ipn_amount_mismatch', [
                'expected' => $payment->amount,
                'got'      => $payload['amount'] ?? 0
            ]);
            return ['ok' => false, 'message' => 'Amount mismatched'];
        }

        // 5) Cập nhật an toàn trong transaction + idempotent
        $order = null;
        DB::transaction(function () use ($payment, $payload, &$order) {
            $payment->refresh();
            $order = $payment->order()->lockForUpdate()->first();

            // Idempotent: nếu đã paid thì bỏ qua
            if ($payment->status === 'paid') {
                return;
            }

            if ((string) $payload['resultCode'] === '0') {
                // Thành công
                $payment->status = 'paid';
                $payment->paid_at = now(); // ➜ THÊM DÒNG NÀY
                $payment->gateway_txn_id = $payload['transId'] ?? $payment->gateway_txn_id;
                $payment->raw_payload = array_merge($payment->raw_payload ?? [], ['ipn' => $payload]);
                $payment->save();

                $order = $payment->order()->lockForUpdate()->first();
                $order->payment_status = 'paid';
                if ($order->status === 'pending') {
                    $order->status = 'confirmed';
                }
                // Nếu bạn đã thêm cột orders.paid_at trong migration thì set, không thì bỏ dòng này
                $order->paid_at = now();
                $order->save();

                Log::channel('payments')->info('momo_ipn_processed_paid', [
                    'order_id'   => $order->id ?? null,
                    'payment_id' => $payment->id ?? null,
                ]);
            } else {
                // Thất bại
                $payment->status = 'failed';
                $payment->raw_payload = array_merge($payment->raw_payload ?? [], ['ipn' => $payload]);
                $payment->save();

                $order = $payment->order()->lockForUpdate()->first();
                $order->payment_status = 'failed';
                $order->save();

                Log::channel('payments')->warning('momo_ipn_processed_failed', [
                    'order_id'   => $order->id ?? null,
                    'payment_id' => $payment->id ?? null,
                    'resultCode' => $payload['resultCode'] ?? null,
                ]);
            }
        });

        // 6) Gửi email sau khi commit (chỉ khi đã paid)
        $payment->refresh();
        if ($order && $payment->status === 'paid') {
            dispatch(new SendPaymentPaidMail($order->id))->onQueue('emails');
        }

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
