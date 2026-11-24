<?php
header('Content-Type: application/json; charset=utf-8');
require_once("config.php");

try {
    $conexion = obtenerConexion();

    // Texto a buscar en matrícula, marca, modelo o nombre del cliente
    $texto = trim($_POST['texto'] ?? '');
    $like = "%" . $texto . "%";

    $sql = "SELECT c.id, c.matricula, c.marca, c.modelo, c.anio, c.fecha_entrada, c.reparar,
                   c.id_cliente, cl.nombre_completo
            FROM COCHE c
            LEFT JOIN CLIENTE cl ON c.id_cliente = cl.id
            WHERE c.deleted_at IS NULL
              AND (c.matricula LIKE ? OR c.marca LIKE ? OR c.modelo LIKE ? OR cl.nombre_completo LIKE ?)
            ORDER BY c.matricula";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssss", $like, $like, $like, $like);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    $stmt->close();
    cerrarConexion($conexion);

    echo json_encode([
        "ok" => true,
        "mensaje" => count($datos) . " coche(s) encontrado(s)",
        "datos" => $datos
    ]);
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al buscar coches: " . $e->getMessage(),
        "datos" => []
    ]);
}
?>
