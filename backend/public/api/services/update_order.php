<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['order']) || !is_array($data['order'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Orden inválido']);
    exit;
}

$stmt = $pdo->prepare("UPDATE services SET position = ? WHERE id = ?");

foreach ($data['order'] as $index => $id) {
    $stmt->execute([$index, $id]);
}

echo json_encode(['success' => true]);
