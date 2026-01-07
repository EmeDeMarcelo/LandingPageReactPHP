<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';

$stmt = $pdo->query("SELECT * FROM banners ORDER BY created_at DESC");
$banners = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
  'success' => true,
  'data' => $banners
]);
