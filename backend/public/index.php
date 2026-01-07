<?php
// Si la petición es para /api/... dejamos pasar a los scripts PHP
$uri = $_SERVER['REQUEST_URI'];

// rutas api = /api/*
if (preg_match('#^/api/#', $uri)) {
    // reescribe a archivo dentro de public/api
    // ejemplo: /api/cotizaciones -> backend/public/api/cotizaciones.php
    $path = __DIR__ . parse_url($uri, PHP_URL_PATH);
    if (is_file($path)) {
        require $path;
    } else {
        http_response_code(404);
        echo json_encode(["error" => "API endpoint not found"]);
    }
    exit;
}

// Si existe archivo estático (dist) servirlo
$requested = __DIR__ . parse_url($uri, PHP_URL_PATH);
if ($uri !== '/' && is_file($requested)) {
    return false; // deja que Apache/Nginx sirva el archivo
}

// Fallback: servir el index.html de la SPA (Vite build)
$index = __DIR__ . '/dist/index.html';
if (file_exists($index)) {
    echo file_get_contents($index);
} else {
    echo "<h1>SPA no construida todavía. Ejecuta npm run build en frontend/</h1>";
}
