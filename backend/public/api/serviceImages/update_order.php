<?php
require_once __DIR__ . "/../../../config/database.php";

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['order'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Orden no recibido']);
    exit;
}

$pdo->beginTransaction();

try {
    foreach ($data['order'] as $position => $id) {
        $stmt = $pdo->prepare(
            "UPDATE service_images SET position = ? WHERE id = ?"
        );
        $stmt->execute([$position + 1, $id]);
    }

    $pdo->commit();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error al actualizar orden']);
}
