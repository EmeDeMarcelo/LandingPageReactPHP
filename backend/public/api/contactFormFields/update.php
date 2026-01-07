<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$fieldId = (int)($data['id'] ?? 0);

if (!$fieldId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID de campo requerido']);
    exit;
}

$check = $pdo->prepare("SELECT id, form_id, field_name FROM contact_form_fields WHERE id = ?");
$check->execute([$fieldId]);
$existing = $check->fetch(PDO::FETCH_ASSOC);

if (!$existing) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Campo no encontrado']);
    exit;
}

$updates = [];
$params = [];

if (isset($data['field_label'])) {
    $updates[] = "field_label = ?";
    $params[] = trim($data['field_label']);
}
if (isset($data['field_type'])) {
    $updates[] = "field_type = ?";
    $params[] = trim($data['field_type']);
}
if (isset($data['field_options'])) {
    $updates[] = "field_options = ?";
    $params[] = json_encode($data['field_options']);
}
if (isset($data['is_required'])) {
    $updates[] = "is_required = ?";
    $params[] = (int)$data['is_required'];
}
if (isset($data['help_text'])) {
    $updates[] = "help_text = ?";
    $params[] = trim($data['help_text']);
}

if (isset($data['field_name'])) {
    $newName = trim($data['field_name']);
    $checkName = $pdo->prepare("SELECT id FROM contact_form_fields WHERE form_id = ? AND field_name = ? AND id != ?");
    $checkName->execute([$existing['form_id'], $newName, $fieldId]);
    if ($checkName->fetch()) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Ya existe otro campo con ese nombre en este formulario']);
        exit;
    }
    $updates[] = "field_name = ?";
    $params[] = $newName;
}

if (empty($updates)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No hay datos para actualizar']);
    exit;
}

$updates[] = "updated_at = NOW()";
$params[] = $fieldId;

try {
    $sql = "UPDATE contact_form_fields SET " . implode(", ", $updates) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    echo json_encode(['success' => true, 'message' => 'Campo actualizado correctamente']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al actualizar el campo']);
}

