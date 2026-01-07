<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../../config/database.php';

if (!isset($_GET['service_id']) || !is_numeric($_GET['service_id'])) {
  http_response_code(400);
  echo json_encode([
    'success' => false,
    'message' => 'service_id inválido'
  ]);
  exit;
}

$serviceId = (int) $_GET['service_id'];

$stmt = $pdo->prepare("
  SELECT
    id,
    image,
    position
  FROM service_images
  WHERE service_id = ?
  ORDER BY position ASC
");

$stmt->execute([$serviceId]);
$images = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
  'success' => true,
  'data' => $images
]);
