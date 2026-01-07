<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../../config/database.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$data = json_decode(file_get_contents('php://input'), true);

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID no proporcionado']);
    exit;
}

try {
    if (isset($data['name'])) {
        $stmt = $pdo->prepare("UPDATE themes SET name = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$data['name'], $id]);
    }

    if (isset($data['settings']) && is_array($data['settings'])) {
        foreach ($data['settings'] as $key => $value) {
            $stmt = $pdo->prepare("
                INSERT INTO theme_settings (theme_id, key_name, value, created_at, updated_at)
                VALUES (?, ?, ?, NOW(), NOW())
                ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW()
            ");
            $stmt->execute([$id, $key, $value]);
        }
    }

    echo json_encode(['success' => true, 'message' => 'Tema actualizado']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos']);
}
