<?php
require_once __DIR__ . '/../../../config/database.php';

$stmt = $pdo->query("
  SELECT title, subtitle, image, link
  FROM banners
  WHERE is_active = 1
  ORDER BY created_at DESC
");

echo json_encode([
  'success' => true,
  'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
]);
