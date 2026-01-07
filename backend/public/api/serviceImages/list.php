<?php
require_once __DIR__ . "/../../../src/middleware/require_auth.php";
require_once __DIR__ . "/../../../config/database.php";
header('Content-Type: application/json');

$serviceId = (int)($_GET['service_id'] ?? 0);

if (!$serviceId) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'service_id requerido',
        'data' => []
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT 
            id,
            image,
            position
        FROM service_images
        WHERE service_id = ?
        ORDER BY position ASC
    ");

    $stmt->execute([$serviceId]);
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $images
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error al cargar imágenes',
        'data' => []
    ]);
}
