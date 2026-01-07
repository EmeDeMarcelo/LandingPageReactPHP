<?php
require_once __DIR__ . "/../../../src/middleware/require_auth.php";
require_once __DIR__ . "/../../../config/database.php";
header('Content-Type: application/json');

$serviceId = (int)($_POST['service_id'] ?? 0);

if (!$serviceId || empty($_FILES['images'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

/* 📁 Carpeta REAL - ruta al directorio público */
$uploadDir = __DIR__ . '/../../uploads/services/';

// 🔑 crear carpeta si no existe
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

/* última posición */
$stmt = $pdo->prepare("
    SELECT COALESCE(MAX(position), 0)
    FROM service_images
    WHERE service_id = ?
");
$stmt->execute([$serviceId]);
$position = (int)$stmt->fetchColumn();

$allowed = ['image/jpeg', 'image/png', 'image/webp'];
$uploaded = [];
$errors = [];

foreach ($_FILES['images']['tmp_name'] as $i => $tmpName) {

    if (!is_uploaded_file($tmpName)) {
        $errors[] = 'Archivo no es upload válido';
        continue;
    }

    if (!in_array($_FILES['images']['type'][$i], $allowed)) {
        $errors[] = 'Tipo no permitido';
        continue;
    }

    $ext = strtolower(pathinfo($_FILES['images']['name'][$i], PATHINFO_EXTENSION));
    $fileName = uniqid('service_', true) . '.' . $ext;

    $targetPath = $uploadDir . $fileName;

    if (!move_uploaded_file($tmpName, $targetPath)) {
        $errors[] = 'No se pudo mover archivo';
        continue;
    }

    /* 🔍 VERIFICACIÓN REAL */
    if (!file_exists($targetPath)) {
        $errors[] = 'Archivo no quedó en disco';
        continue;
    }

    $position++;

    $stmt = $pdo->prepare("
        INSERT INTO service_images (service_id, image, position)
        VALUES (?, ?, ?)
    ");

    // 🔑 Normalizar ruta: asegurar que siempre tenga / inicial
    $imagePath = '/uploads/services/' . $fileName;
    
    $stmt->execute([
        $serviceId,
        $imagePath,
        $position
    ]);

    $uploaded[] = $fileName;
}

echo json_encode([
    'success' => count($uploaded) > 0,
    'uploaded' => $uploaded,
    'errors' => $errors
]);
