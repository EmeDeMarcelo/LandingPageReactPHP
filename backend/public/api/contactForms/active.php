<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../../config/database.php';

try {
    $stmt = $pdo->query("SELECT id, name, version, description, is_active, created_at, updated_at FROM contact_forms WHERE is_active = 1 LIMIT 1");
    $form = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$form) {
        echo json_encode(['success' => true, 'data' => null, 'message' => 'No hay formulario activo.']);
        exit;
    }

    // Obtener campos
    $stmtFields = $pdo->prepare("
        SELECT id, field_name, field_label, field_type, field_options, is_required, position, help_text
        FROM contact_form_fields
        WHERE form_id = ?
        ORDER BY position ASC
    ");
    $stmtFields->execute([$form['id']]);
    $fields = $stmtFields->fetchAll(PDO::FETCH_ASSOC);

    foreach ($fields as &$field) {
        $field['field_options'] = json_decode($field['field_options'], true) ?? [];
        if ($field['field_type'] === 'service_select') {
            $stmtServices = $pdo->query("SELECT id, title FROM services WHERE is_active = 1 ORDER BY position ASC");
            $field['service_options'] = $stmtServices->fetchAll(PDO::FETCH_ASSOC);
        }
    }
    unset($field);

    $form['fields'] = $fields;

    echo json_encode(['success' => true, 'data' => $form]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}

