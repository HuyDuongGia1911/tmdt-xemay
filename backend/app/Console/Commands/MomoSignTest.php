<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class MomoSignTest extends Command
{
    protected $signature = 'momo:sign-test';
    protected $description = 'Test MoMo signature and API call with production key';

    public function handle()
    {
        $cfg = config('payments.momo');

        $amount = 1000; // số tiền test
        $orderId = 'TX-TEST-' . time();
        $requestId = (string) Str::uuid();

        $payload = [
            'partnerCode' => $cfg['partner_code'],
            'requestId'   => $requestId,
            'amount'      => (string) $amount,
            'orderId'     => $orderId,
            'orderInfo'   => 'Payment for order TEST', // bỏ dấu #
            'redirectUrl' => $cfg['redirect_url'],
            'ipnUrl'      => $cfg['ipn_url'],
            'extraData'   => '',
            'requestType' => 'captureWallet',
        ];

        // raw string theo doc
        $raw = "accessKey={$cfg['access_key']}"
            . "&amount={$payload['amount']}"
            . "&extraData={$payload['extraData']}"
            . "&ipnUrl={$payload['ipnUrl']}"
            . "&orderId={$payload['orderId']}"
            . "&orderInfo={$payload['orderInfo']}"
            . "&partnerCode={$payload['partnerCode']}"
            . "&redirectUrl={$payload['redirectUrl']}"
            . "&requestId={$payload['requestId']}"
            . "&requestType={$payload['requestType']}";

        $payload['signature'] = hash_hmac('sha256', $raw, $cfg['secret_key']);

        $this->info("RAW STRING:\n" . $raw);
        $this->info("SIGNATURE LOCAL: " . $payload['signature']);

        // Gọi API MoMo
        $res = Http::asJson()->post($cfg['endpoint']['create'], $payload);
        $data = $res->json();

        $this->info("=== RESPONSE FROM MOMO ===");
        dump($data);

        return 0;
    }
}
