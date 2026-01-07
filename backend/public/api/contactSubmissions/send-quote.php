<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../src/mail/MailService.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$submissionId = (int)($data['submission_id'] ?? 0);
$price = (float)($data['price'] ?? 0);
$message = trim($data['message'] ?? null);

if (!$submissionId || $price <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID de envío y precio válido son obligatorios.']);
    exit;
}

try {
    $mailService = new MailService();
    $mailService->sendQuote($submissionId, $price, $message);

    echo json_encode(['success' => true, 'message' => 'Cotización enviada y estado actualizado correctamente.']);
} catch (Exception $e) {
    http_response_code(500);
    error_log("Error en send-quote.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error al enviar la cotización: ' . $e->getMessage()]);
}

