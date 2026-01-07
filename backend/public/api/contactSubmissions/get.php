<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';
header('Content-Type: application/json');

$submissionId = (int)($_GET['id'] ?? 0);

if (!$submissionId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID de envío requerido.']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT
            cs.id,
            cs.form_id,
            cf.name AS form_name,
            cf.version AS form_version,
            cs.service_id,
            s.title AS service_title,
            cs.status,
            cs.ip_address,
            cs.user_agent,
            cs.notes,
            cs.created_at,
            cs.updated_at,
            cs.quoted_price,
            cs.quoted_at,
            cs.email_confirmation_sent,
            cs.email_quote_sent,
            cs.email_confirmation_sent_at,
            cs.email_quote_sent_at
        FROM contact_submissions cs
        JOIN contact_forms cf ON cs.form_id = cf.id
        LEFT JOIN services s ON cs.service_id = s.id
        WHERE cs.id = ?
    ");
    $stmt->execute([$submissionId]);
    $submission = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$submission) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Envío no encontrado.']);
        exit;
    }

    $stmtData = $pdo->prepare("
        SELECT
            csd.field_value,
            cff.field_name,
            cff.field_label,
            cff.field_type
        FROM contact_submission_data csd
        INNER JOIN contact_form_fields cff ON csd.field_id = cff.id
        WHERE csd.submission_id = ?
        ORDER BY cff.position ASC
    ");
    $stmtData->execute([$submissionId]);
    $submissionData = $stmtData->fetchAll(PDO::FETCH_ASSOC);

    $submission['data'] = $submissionData;

    echo json_encode(['success' => true, 'data' => $submission]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}

