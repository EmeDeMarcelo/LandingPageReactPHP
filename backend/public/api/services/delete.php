<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = (int)($data['id'] ?? 0);

if (!$id) {
  http_response_code(400);
  echo json_encode(['message' => 'ID inválido']);
  exit;
}

$stmt = $pdo->prepare("DELETE FROM services WHERE id = ?");
$stmt->execute([$id]);

echo json_encode(['success' => true]);
