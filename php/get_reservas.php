<?php
header('Content-Type: application/json; charset=utf-8');
require_once("config.php");

try {
    $conexion = obtenerConexion();

    // Devuelve todas las columnas de RESERVA ordenadas de más reciente a más antigua
    $sql = "SELECT * FROM RESERVA";
    $resultado = $conexion->query($sql);

    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    echo json_encode([
        "ok" => true,
        "datos" => $datos
    ]);

    cerrarConexion($conexion);
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al obtener las reservas: " . $e->getMessage()
    ]);
}
?>