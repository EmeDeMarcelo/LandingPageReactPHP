<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$formId = (int)($data['form_id'] ?? 0);
$fieldName = trim($data['field_name'] ?? '');
$fieldLabel = trim($data['field_label'] ?? '');
$fieldType = trim($data['field_type'] ?? 'text');
$isRequired = (int)($data['is_required'] ?? 0);
$helpText = trim($data['help_text'] ?? '');
$fieldOptions = isset($data['field_options']) ? json_encode($data['field_options']) : null;

if (!$formId || !$fieldName || !$fieldLabel || !$fieldType) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

// Validar form existe
$check = $pdo->prepare("SELECT id FROM contact_forms WHERE id = ?");
$check->execute([$formId]);
if (!$check->fetch()) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Formulario no encontrado']);
    exit;
}

// Validar duplicado field_name
$checkField = $pdo->prepare("SELECT id FROM contact_form_fields WHERE form_id = ? AND field_name = ?");
$checkField->execute([$formId, $fieldName]);
if ($checkField->fetch()) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Ya existe un campo con ese nombre en este formulario']);
    exit;
}

// siguiente posición
$posStmt = $pdo->prepare("SELECT IFNULL(MAX(position), 0) + 1 FROM contact_form_fields WHERE form_id = ?");
$posStmt->execute([$formId]);
$position = (int)$posStmt->fetchColumn();

try {
    $stmt = $pdo->prepare("
        INSERT INTO contact_form_fields
        (form_id, field_name, field_label, field_type, field_options, is_required, position, help_text, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ");
    $stmt->execute([
        $formId,
        $fieldName,
        $fieldLabel,
        $fieldType,
        $fieldOptions,
        $isRequired,
        $position,
        $helpText
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Campo creado correctamente',
        'data' => ['id' => $pdo->lastInsertId()]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al crear el campo']);
}

