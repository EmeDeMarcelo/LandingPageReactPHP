<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$order = $data['order'] ?? [];

if (!is_array($order) || empty($order)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Orden de campos inválida.']);
    exit;
}

try {
    $pdo->beginTransaction();
    $stmt = $pdo->prepare("UPDATE contact_form_fields SET position = ? WHERE id = ?");
    foreach ($order as $index => $fieldId) {
        $stmt->execute([$index, $fieldId]);
    }
    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Orden de campos actualizada correctamente.']);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}

