<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

$title = trim($data['title'] ?? '');
$subtitle = trim($data['subtitle'] ?? '');
$short = trim($data['short_description'] ?? '');
$long = trim($data['long_description'] ?? '');
$image = trim($data['image'] ?? '');
$isActive = (int)($data['is_active'] ?? 1);

if (strlen($title) < 3) {
  http_response_code(400);
  echo json_encode(['message' => 'Título inválido']);
  exit;
}

if (!$image) {
  http_response_code(400);
  echo json_encode(['message' => 'Imagen requerida']);
  exit;
}

/* 🔹 Obtener siguiente posición */
$posStmt = $pdo->query("SELECT IFNULL(MAX(position), 0) + 1 FROM services");
$nextPosition = (int)$posStmt->fetchColumn();

/* 🔹 Insert */
$stmt = $pdo->prepare("
  INSERT INTO services
    (title, subtitle, short_description, long_description, image, is_active, position)
  VALUES
    (?, ?, ?, ?, ?, ?, ?)
");

$stmt->execute([
  $title,
  $subtitle,
  $short,
  $long,
  $image,
  $isActive,
  $nextPosition
]);

echo json_encode(['success' => true]);
