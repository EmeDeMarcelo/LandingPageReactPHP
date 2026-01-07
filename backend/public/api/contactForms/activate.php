<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$formId = (int)($data['id'] ?? 0);

if (!$formId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID de formulario no proporcionado.']);
    exit;
}

try {
    $pdo->beginTransaction();

    $pdo->query("UPDATE contact_forms SET is_active = 0");

    $stmt = $pdo->prepare("UPDATE contact_forms SET is_active = 1, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$formId]);

    if ($stmt->rowCount() === 0) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Formulario no encontrado o ya estaba activo.']);
        exit;
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Formulario activado correctamente.']);
} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}

