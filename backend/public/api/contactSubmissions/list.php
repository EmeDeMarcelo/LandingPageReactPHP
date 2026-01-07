<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';
header('Content-Type: application/json');

$page = (int)($_GET['page'] ?? 1);
$limit = (int)($_GET['limit'] ?? 20);
$status = $_GET['status'] ?? null;
$formId = isset($_GET['form_id']) ? (int)$_GET['form_id'] : null;

$offset = ($page - 1) * $limit;

try {
    $where = [];
    $params = [];
    if ($status) {
        $where[] = "cs.status = ?";
        $params[] = $status;
    }
    if ($formId) {
        $where[] = "cs.form_id = ?";
        $params[] = $formId;
    }
    $whereClause = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

    $sql = "
        SELECT 
            cs.id,
            cs.form_id,
            cs.service_id,
            cs.status,
            cs.ip_address,
            cs.notes,
            cs.created_at,
            cs.updated_at,
            cs.quoted_price,
            cs.quoted_at,
            cs.email_confirmation_sent,
            cs.email_quote_sent,
            cf.name as form_name,
            cf.version as form_version,
            s.title as service_title
        FROM contact_submissions cs
        LEFT JOIN contact_forms cf ON cs.form_id = cf.id
        LEFT JOIN services s ON cs.service_id = s.id
        $whereClause
        ORDER BY cs.created_at DESC
        LIMIT " . (int)$limit . " OFFSET " . (int)$offset . "
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $countSql = "SELECT COUNT(*) FROM contact_submissions cs $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    echo json_encode([
        'success' => true,
        'data' => $submissions,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => ceil($total / $limit)
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Error en contactSubmissions/list.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error al cargar envíos']);
}

