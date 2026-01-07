<?php
require_once __DIR__ . '/env.php';

return [
    'host' => $_ENV['SMTP_HOST'] ?? 'localhost',
    'port' => (int)($_ENV['SMTP_PORT'] ?? 587),
    'secure' => $_ENV['SMTP_SECURE'] ?? 'tls',
    'auth' => true,
    'username' => $_ENV['SMTP_USER'] ?? '',
    'password' => $_ENV['SMTP_PASS'] ?? '',
    'from_email' => $_ENV['SMTP_FROM_EMAIL'] ?? 'no-reply@example.com',
    'from_name' => $_ENV['SMTP_FROM_NAME'] ?? 'Emedev',
    'smtp_options' => [
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        ]
    ]
];

