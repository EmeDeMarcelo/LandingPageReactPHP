<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../../config/database.php';

try {
    $stmt = $pdo->query("SELECT * FROM themes WHERE is_active = 1");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$rows) {
        echo json_encode(['success' => false, 'message' => 'No hay tema activo']);
        exit;
    }

    $theme_id = $rows[0]['id'];

    // Obtener settings
    $stmt = $pdo->prepare("
        SELECT t.id, t.name, t.is_active, t.created_at, t.updated_at,
               s.key_name, s.value
        FROM themes t
        LEFT JOIN theme_settings s ON t.id = s.theme_id
        WHERE t.id = ?
    ");
    $stmt->execute([$theme_id]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $theme = [
        'id' => $rows[0]['id'],
        'name' => $rows[0]['name'],
        'is_active' => (int)$rows[0]['is_active'],
        'created_at' => $rows[0]['created_at'],
        'updated_at' => $rows[0]['updated_at'],
        'settings' => []
    ];
    foreach ($rows as $row) {
        if ($row['key_name']) {
            $theme['settings'][$row['key_name']] = $row['value'];
        }
    }

    echo json_encode(['success' => true, 'data' => $theme]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos']);
}
