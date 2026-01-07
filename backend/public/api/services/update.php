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

$stmt = $pdo->prepare("
  UPDATE services SET
    title = ?,
    subtitle = ?,
    short_description = ?,
    long_description = ?,
    image = ?,
    is_active = ?
  WHERE id = ?
");

$stmt->execute([
  trim($data['title'] ?? ''),
  trim($data['subtitle'] ?? ''),
  trim($data['short_description'] ?? ''),
  trim($data['long_description'] ?? ''),
  trim($data['image'] ?? ''),
  (int)($data['is_active'] ?? 1),
  $id
]);

echo json_encode(['success' => true]);
