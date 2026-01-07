<?php
require_once __DIR__ . '/../../../src/middleware/require_auth.php';
require_once __DIR__ . '/../../../config/database.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$name = trim($data['name'] ?? '');
$version = trim($data['version'] ?? '1.0');
$description = trim($data['description'] ?? null);
$isActive = (int)($data['is_active'] ?? 0);

if (empty($name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'El nombre del formulario es obligatorio.']);
    exit;
}

try {
    // Validar duplicado nombre+versión
    $stmt = $pdo->prepare("SELECT id FROM contact_forms WHERE name = ? AND version = ?");
    $stmt->execute([$name, $version]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Ya existe un formulario con este nombre y versión.']);
        exit;
    }

    // Si se activa este formulario, desactivar otros
    if ($isActive) {
        $pdo->query("UPDATE contact_forms SET is_active = 0");
    }

    $stmt = $pdo->prepare("
        INSERT INTO contact_forms (name, version, description, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
    ");
    $stmt->execute([$name, $version, $description, $isActive]);

    echo json_encode(['success' => true, 'message' => 'Formulario creado correctamente.', 'id' => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}

