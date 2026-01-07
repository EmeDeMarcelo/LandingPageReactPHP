<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['title'])) {
  http_response_code(400);
  echo json_encode([
    'error' => 'Datos inválidos'
  ]);
  exit;
}

// 🔎 Validar duplicado
$check = $pdo->prepare("SELECT id FROM banners WHERE title = ?");
$check->execute([$data['title']]);

if ($check->fetch()) {
  http_response_code(409);
  echo json_encode([
    'error' => 'Ya existe un banner con ese título'
  ]);
  exit;
}

// ✅ Insertar
$stmt = $pdo->prepare("
  INSERT INTO banners (title, subtitle, image, link, is_active)
  VALUES (?, ?, ?, ?, ?)
");

$stmt->execute([
  $data['title'],
  $data['subtitle'] ?? '',
  $data['image'] ?? '',
  $data['link'] ?? '',
  $data['is_active'] ?? 1
]);

echo json_encode([
  'success' => true
]);
