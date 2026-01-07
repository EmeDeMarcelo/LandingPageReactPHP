<?php
// backend/src/middleware/require_auth.php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode([
        'authenticated' => false,
        'message' => 'No autenticado'
    ]);
    exit;
}
