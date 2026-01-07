<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';

header('Content-Type: application/json');

if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['message' => 'No se envió archivo']);
    exit;
}

$allowed = ['image/jpeg', 'image/png', 'image/webp'];

if (!in_array($_FILES['image']['type'], $allowed)) {
    http_response_code(400);
    echo json_encode(['message' => 'Formato no permitido']);
    exit;
}

// 🔑 ruta ABSOLUTA al directorio público
$uploadDir = __DIR__ . '/../../uploads/';

// 🔑 crear carpeta si no existe
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
$filename = uniqid('banner_') . '.' . $ext;

$targetPath = $uploadDir . $filename;

if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(['message' => 'Error al guardar imagen']);
    exit;
}

// 🔑 ruta pública (para el navegador)
echo json_encode([
    'success' => true,
    'path' => '/uploads/' . $filename
]);
