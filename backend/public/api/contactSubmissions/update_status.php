<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$submissionId = (int)($data['id'] ?? 0);
$newStatus = trim($data['status'] ?? '');
$notes = trim($data['notes'] ?? null);

if (!$submissionId || empty($newStatus)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID de envío y estado son obligatorios.']);
    exit;
}

$allowed = ['pending', 'read', 'contacted', 'quoted', 'closed'];
if (!in_array($newStatus, $allowed)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Estado inválido.']);
    exit;
}

$check = $pdo->prepare("SELECT id FROM contact_submissions WHERE id = ?");
$check->execute([$submissionId]);
if (!$check->fetch()) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Envío no encontrado']);
    exit;
}

try {
    if ($notes !== null) {
        $stmt = $pdo->prepare("
            UPDATE contact_submissions 
            SET status = ?, notes = ?, updated_at = NOW() 
            WHERE id = ?
        ");
        $stmt->execute([$newStatus, $notes, $submissionId]);
    } else {
        $stmt = $pdo->prepare("
            UPDATE contact_submissions 
            SET status = ?, notes = NULL, updated_at = NOW() 
            WHERE id = ?
        ");
        $stmt->execute([$newStatus, $submissionId]);
    }

    echo json_encode(['success' => true, 'message' => 'Estado actualizado correctamente']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al actualizar el estado']);
}

