<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

$stmt = $pdo->prepare("DELETE FROM banners WHERE id = ?");
$stmt->execute([$data['id']]);

echo json_encode(['success' => true]);
