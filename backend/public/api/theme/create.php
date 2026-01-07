<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || !$data['name']) {
    echo json_encode(['success' => false, 'message' => 'Nombre obligatorio']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO themes (name, is_active, created_at, updated_at) VALUES (?, 0, NOW(), NOW())");
    $stmt->execute([$data['name']]);
    $theme_id = $pdo->lastInsertId();

    if (isset($data['settings']) && is_array($data['settings'])) {
        $stmt2 = $pdo->prepare("INSERT INTO theme_settings (theme_id, key_name, value, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())");
        foreach ($data['settings'] as $key => $value) {
            $stmt2->execute([$theme_id, $key, $value]);
        }
    }

    echo json_encode(['success' => true, 'message' => 'Tema creado', 'id' => $theme_id]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos']);
}
