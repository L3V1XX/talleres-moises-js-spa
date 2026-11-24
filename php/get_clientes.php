<?php
// Clientes activos para rellenar los desplegables (borrado lógico: deleted_at IS NULL)
header('Content-Type: application/json; charset=utf-8');
require_once("config.php");

try {
    $conexion = obtenerConexion();

    $resultado = $conexion->query("SELECT id, nombre_completo FROM CLIENTE WHERE deleted_at IS NULL ORDER BY nombre_completo");

    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    cerrarConexion($conexion);

    echo json_encode([
        "ok" => true,
        "mensaje" => "Clientes recuperados correctamente",
        "datos" => $datos
    ]);
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al obtener los clientes: " . $e->getMessage(),
        "datos" => []
    ]);
}
?>
