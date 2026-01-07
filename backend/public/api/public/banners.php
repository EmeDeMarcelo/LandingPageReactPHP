<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../../config/database.php';

$stmt = $pdo->query("
  SELECT *
  FROM banners
  WHERE is_active = 1
  ORDER BY position ASC
");

$banners = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
  'success' => true,
  'data' => $banners
]);
