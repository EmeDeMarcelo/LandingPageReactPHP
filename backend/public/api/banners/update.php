<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

$stmt = $pdo->prepare("
  UPDATE banners SET
    title = ?,
    subtitle = ?,
    image = ?,
    link = ?,
    is_active = ?
  WHERE id = ?
");

$stmt->execute([
  $data['title'],
  $data['subtitle'],
  $data['image'],
  $data['link'],
  $data['is_active'],
  $data['id']
]);

echo json_encode(['success' => true]);
