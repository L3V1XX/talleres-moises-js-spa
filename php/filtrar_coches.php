<?php
header('Content-Type: application/json; charset=utf-8');
require_once("config.php");

try {
    $conexion = obtenerConexion();

    $marca = trim($_POST['marca'] ?? '');
    $idCliente = $_POST['id_cliente'] ?? '';
    $reparar = $_POST['reparar'] ?? '';
    $anioMin = $_POST['anio_min'] ?? '';
    $anioMax = $_POST['anio_max'] ?? '';

    $sql = "SELECT c.id, c.matricula, c.marca, c.modelo, c.anio, c.fecha_entrada, c.reparar,
                   c.id_cliente, cl.nombre_completo
            FROM COCHE c
            LEFT JOIN CLIENTE cl ON c.id_cliente = cl.id
            WHERE c.deleted_at IS NULL";

    // Solo se añade la condición de los filtros que se han rellenado.
    // intval() asegura que lo que se concatena en la consulta es un número.
    if ($marca !== '') {
        $sql .= " AND c.marca LIKE '%" . $conexion->real_escape_string($marca) . "%'";
    }
    if ($idCliente !== '') {
        $sql .= " AND c.id_cliente = " . intval($idCliente);
    }
    if ($reparar !== '') {
        $sql .= " AND c.reparar = " . intval($reparar);
    }
    if ($anioMin !== '') {
        $sql .= " AND c.anio >= " . intval($anioMin);
    }
    if ($anioMax !== '') {
        $sql .= " AND c.anio <= " . intval($anioMax);
    }
    $sql .= " ORDER BY c.matricula";

    $resultado = $conexion->query($sql);

    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    cerrarConexion($conexion);

    echo json_encode([
        "ok" => true,
        "mensaje" => count($datos) . " coche(s) encontrado(s)",
        "datos" => $datos
    ]);
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al filtrar coches: " . $e->getMessage(),
        "datos" => []
    ]);
}
?>
