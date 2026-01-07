<?php
require_once __DIR__ . "/../../../src/middleware/require_auth.php";
require_once __DIR__ . "/../../../config/database.php";
header('Content-Type: application/json');

$id = (int)($_POST['id'] ?? 0);

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'ID requerido']);
    exit;
}

/* obtener imagen */
$stmt = $pdo->prepare("
    SELECT image FROM service_images WHERE id = ?
");
$stmt->execute([$id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    http_response_code(404);
    echo json_encode(['error' => 'Imagen no encontrada']);
    exit;
}

/* borrar archivo físico */
// La ruta en BD es 'uploads/services/archivo.jpg'
// Desde backend/public/api/serviceImages/ necesitamos ir a backend/public/
$filePath = __DIR__ . '/../../' . $row['image'];
if (file_exists($filePath)) {
    @unlink($filePath); // safe para hosting compartido
}

/* borrar DB */
$stmt = $pdo->prepare("DELETE FROM service_images WHERE id = ?");
$stmt->execute([$id]);

echo json_encode(['success' => true]);
