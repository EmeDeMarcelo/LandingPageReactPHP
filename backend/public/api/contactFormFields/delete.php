<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$fieldId = (int)($data['id'] ?? 0);

if (!$fieldId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID de campo no proporcionado.']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM contact_form_fields WHERE id = ?");
    $stmt->execute([$fieldId]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Campo no encontrado.']);
        exit;
    }

    echo json_encode(['success' => true, 'message' => 'Campo eliminado correctamente.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}

