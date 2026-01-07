<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT id, name, version, description, is_active, created_at, updated_at FROM contact_forms WHERE is_active = 1 LIMIT 1");
        $form = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$form) {
            echo json_encode(['success' => true, 'data' => null, 'message' => 'No hay formulario activo.']);
            exit;
        }

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
                $field['services'] = $stmtServices->fetchAll(PDO::FETCH_ASSOC);
            }
        }
        unset($field);

        $form['fields'] = $fields;

        echo json_encode(['success' => true, 'data' => $form]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error en la base de datos']);
    }
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $formId = (int)($input['form_id'] ?? 0);
    $serviceId = (int)($input['service_id'] ?? null);
    $formData = $input['form_data'] ?? [];

    if (!$formId || empty($formData)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos de envío incompletos.']);
        exit;
    }

    try {
        $pdo->beginTransaction();

        $stmtForm = $pdo->prepare("SELECT id FROM contact_forms WHERE id = ? AND is_active = 1");
        $stmtForm->execute([$formId]);
        if (!$stmtForm->fetch()) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Formulario no encontrado o no está activo.']);
            exit;
        }

        if ($serviceId) {
            $stmtService = $pdo->prepare("SELECT id FROM services WHERE id = ? AND is_active = 1");
            $stmtService->execute([$serviceId]);
            if (!$stmtService->fetch()) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Servicio seleccionado no encontrado o no está activo.']);
                exit;
            }
        }

        $stmtSubmission = $pdo->prepare("
            INSERT INTO contact_submissions (form_id, service_id, status, ip_address, user_agent, created_at, updated_at)
            VALUES (?, ?, 'pending', ?, ?, NOW(), NOW())
        ");
        $stmtSubmission->execute([
            $formId,
            $serviceId > 0 ? $serviceId : null,
            $_SERVER['REMOTE_ADDR'] ?? 'UNKNOWN',
            $_SERVER['HTTP_USER_AGENT'] ?? 'UNKNOWN'
        ]);
        $submissionId = $pdo->lastInsertId();

        $stmtFields = $pdo->prepare("SELECT id, field_name, is_required FROM contact_form_fields WHERE form_id = ?");
        $stmtFields->execute([$formId]);
        $defined = $stmtFields->fetchAll(PDO::FETCH_ASSOC);
        $definedMap = [];
        foreach ($defined as $row) {
            $definedMap[$row['field_name']] = [
                'id' => $row['id'],
                'is_required' => (int)$row['is_required']
            ];
        }

        $stmtData = $pdo->prepare("
            INSERT INTO contact_submission_data (submission_id, field_id, field_value, created_at)
            VALUES (?, ?, ?, NOW())
        ");

        foreach ($formData as $fieldName => $fieldValue) {
            if (isset($definedMap[$fieldName])) {
                $fieldId = $definedMap[$fieldName]['id'];
                $stmtData->execute([$submissionId, $fieldId, $fieldValue]);
            }
        }

        $pdo->commit();

        // Enviar email de confirmación (no bloquear respuesta)
        try {
            require_once __DIR__ . '/../../../src/mail/MailService.php';
            $mailService = new MailService();
            $mailService->sendConfirmation($submissionId);
        } catch (Exception $e) {
            error_log("Error enviando correo de confirmación para envío $submissionId: " . $e->getMessage());
        }

        echo json_encode([
            'success' => true,
            'message' => 'Formulario enviado correctamente',
            'data' => ['submission_id' => $submissionId]
        ]);
    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al guardar el formulario']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Método no permitido.']);

