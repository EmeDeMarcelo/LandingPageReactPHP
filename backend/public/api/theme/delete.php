<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../../config/database.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID no proporcionado']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM theme_settings WHERE theme_id = ?");
    $stmt->execute([$id]);

    $stmt = $pdo->prepare("DELETE FROM themes WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true, 'message' => 'Tema eliminado']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos']);
}
