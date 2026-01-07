<?php
header('Content-Type: application/json');
require_once '../../../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Credenciales inválidas']);
    exit;
}

session_start();
$_SESSION['user'] = [
    'id' => $user['id'],
    'email' => $user['email'],
    'name' => $user['name'],
    'role' => $user['role']
];

echo json_encode([
    'message' => 'Login correcto',
    'user' => $_SESSION['user']
]);
