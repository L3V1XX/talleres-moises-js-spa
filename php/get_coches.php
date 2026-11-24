<?php
// Listado de coches activos (borrado lógico: deleted_at IS NULL)
header('Content-Type: application/json; charset=utf-8');
require_once("config.php");

try {
    $conexion = obtenerConexion();

    $resultado = $conexion->query("SELECT c.id, c.matricula, c.marca, c.modelo, c.anio, c.fecha_entrada, c.reparar,
                                          c.id_cliente, cl.nombre_completo
                                   FROM COCHE c
                                   LEFT JOIN CLIENTE cl ON c.id_cliente = cl.id
                                   WHERE c.deleted_at IS NULL
                                   ORDER BY c.matricula");

    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    cerrarConexion($conexion);

    echo json_encode([
        "ok" => true,
        "mensaje" => "Coches recuperados correctamente",
        "datos" => $datos
    ]);
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al obtener los coches: " . $e->getMessage(),
        "datos" => []
    ]);
}
?>
