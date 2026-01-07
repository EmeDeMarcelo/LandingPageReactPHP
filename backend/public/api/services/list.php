<?php
require_once __DIR__ . '/../../../config/database.php';

$stmt = $pdo->query("
  SELECT
    id,
    title,
    subtitle,
    short_description,
    long_description,
    image,
    is_active,
    position
  FROM services
  ORDER BY position ASC
");

$services = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
  'success' => true,
  'data' => $services
]);
