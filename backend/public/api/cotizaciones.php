<?php
header('Content-Type: application/json; charset=utf-8');

// ejemplo: /api/cotizaciones -> POST guarda cotización (temporal)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // aquí procesarías $_POST o php://input JSON
    echo json_encode(["ok" => true, "msg" => "endpoint cotizaciones funcionando"]);
    exit;
}

echo json_encode(["ok" => false, "msg" => "metodo no soportado"]);
