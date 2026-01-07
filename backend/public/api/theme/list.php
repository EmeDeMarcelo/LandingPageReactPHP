<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../../config/database.php';

try {
    $stmt = $pdo->query("
        SELECT t.id, t.name, t.is_active, t.created_at, t.updated_at,
               s.key_name, s.value
        FROM themes t
        LEFT JOIN theme_settings s ON t.id = s.theme_id
        ORDER BY t.id ASC
    ");

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Agrupar settings por tema
    $themes = [];
    foreach ($rows as $row) {
        $id = $row['id'];
        if (!isset($themes[$id])) {
            $themes[$id] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'is_active' => (int)$row['is_active'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at'],
                'settings' => []
            ];
        }
        if ($row['key_name']) {
            $themes[$id]['settings'][$row['key_name']] = $row['value'];
        }
    }

    echo json_encode(['success' => true, 'data' => array_values($themes)]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
}
