<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';

header('Content-Type: application/json');

if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['message' => 'No se recibió imagen']);
    exit;
}

$file = $_FILES['image'];
$allowed = ['image/jpeg', 'image/png', 'image/webp'];

if (!in_array($file['type'], $allowed)) {
    http_response_code(400);
    echo json_encode(['message' => 'Formato de imagen no permitido']);
    exit;
}

$uploadDir = __DIR__ . '/../../../public/uploads/services/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('service_') . '.' . $extension;
$targetPath = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(['message' => 'Error al guardar la imagen']);
    exit;
}

echo json_encode([
    'success' => true,
    'path' => '/uploads/services/' . $filename
]);
