<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../../config/database.php';

$stmt = $pdo->query("
  SELECT
    id,
    title,
    subtitle,
    short_description,
    long_description,
    image,
    position
  FROM services
  WHERE is_active = 1
  ORDER BY position ASC
");

$services = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
  'success' => true,
  'data' => $services
]);
