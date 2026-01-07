<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';
header('Content-Type: application/json');

$formId = (int)($_GET['form_id'] ?? 0);

if (!$formId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID de formulario requerido.']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT id, form_id, field_name, field_label, field_type, field_options, is_required, position, help_text, created_at, updated_at
        FROM contact_form_fields
        WHERE form_id = ?
        ORDER BY position ASC
    ");
    $stmt->execute([$formId]);
    $fields = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($fields as &$field) {
        $field['field_options'] = json_decode($field['field_options'], true) ?? [];
    }
    unset($field);

    echo json_encode(['success' => true, 'data' => $fields]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}

