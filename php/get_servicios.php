<?php
header('Content-Type: application/json; charset=utf-8');
require_once("config.php");

try {
    $conexion = obtenerConexion();

    $sql = "SELECT id, fecha, descripcion, tiempo_estimado, garantia, precio_base, id_reserva, terminada, imagen FROM SERVICIO";
    $resultado = $conexion->query($sql);

    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    cerrarConexion($conexion);

    echo json_encode([
        "ok" => true,
        "mensaje" => "Listado recuperado correctamente",
        "datos" => $datos
    ]);
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al obtener los servicios: " . $e->getMessage(),
        "datos" => []
    ]);
}
?>