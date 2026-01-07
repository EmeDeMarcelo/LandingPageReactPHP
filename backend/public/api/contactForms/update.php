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
    $stmt = $pdo->prepare("SELECT id FROM contact_forms WHERE id = ?");
    $stmt->execute([$formId]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Formulario no encontrado.']);
        exit;
    }

    $set = [];
    $params = [];

    if (isset($data['name'])) {
        $name = trim($data['name']);
        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'El nombre del formulario no puede estar vacío.']);
            exit;
        }
        $set[] = 'name = ?';
        $params[] = $name;
    }
    if (isset($data['version'])) {
        $set[] = 'version = ?';
        $params[] = trim($data['version']);
    }
    if (isset($data['description'])) {
        $set[] = 'description = ?';
        $params[] = trim($data['description']);
    }
    if (isset($data['is_active'])) {
        $set[] = 'is_active = ?';
        $params[] = (int)$data['is_active'];
    }

    if (empty($set)) {
        echo json_encode(['success' => false, 'message' => 'No hay datos para actualizar.']);
        exit;
    }

    $set[] = 'updated_at = NOW()';
    $params[] = $formId;

    $sql = "UPDATE contact_forms SET " . implode(', ', $set) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['success' => true, 'message' => 'Formulario actualizado correctamente.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}

