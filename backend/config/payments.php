<?php

return [
    'momo' => [
        'partner_code' => env('MOMO_PARTNER_CODE'),
        'access_key'   => env('MOMO_ACCESS_KEY'),
        'secret_key'   => env('MOMO_SECRET_KEY'),
        'endpoint'     => [
            'create' => env('MOMO_ENDPOINT_CREATE'),
            'query'  => env('MOMO_ENDPOINT_QUERY'),
        ],
        'redirect_url' => env('MOMO_REDIRECT_URL'),
        'ipn_url'      => env('MOMO_IPN_URL'),
    ],

    'vnpay' => [
        'tmn_code'    => env('VNPAY_TMN_CODE'),
        'hash_secret' => env('VNPAY_HASH_SECRET'),
        'endpoint'    => env('VNPAY_ENDPOINT'),
        'return_url'  => env('VNPAY_RETURN_URL'),
        'ipn_url'     => env('VNPAY_IPN_URL'),
    ],
];
