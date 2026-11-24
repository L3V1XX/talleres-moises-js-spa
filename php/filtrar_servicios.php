<?php
header('Content-Type: application/json; charset=utf-8');
require_once("config.php");

try {
    $conexion = obtenerConexion();

    $condiciones = [];
    $tipos = "";
    $valores = [];

    if (isset($_POST['id_reserva']) && $_POST['id_reserva'] !== '') {
        $condiciones[] = "id_reserva = ?";
        $tipos .= "i";
        $valores[] = intval($_POST['id_reserva']);
    }

    if (isset($_POST['fecha_desde']) && $_POST['fecha_desde'] !== '') {
        $condiciones[] = "fecha >= ?";
        $tipos .= "s";
        $valores[] = $_POST['fecha_desde'];
    }

    if (isset($_POST['fecha_hasta']) && $_POST['fecha_hasta'] !== '') {
        $condiciones[] = "fecha <= ?";
        $tipos .= "s";
        $valores[] = $_POST['fecha_hasta'];
    }

    if (isset($_POST['terminada']) && $_POST['terminada'] !== '') {
        $condiciones[] = "terminada = ?";
        $tipos .= "i";
        $valores[] = intval($_POST['terminada']);
    }

    $sql = "SELECT * FROM SERVICIO";
    if (count($condiciones) > 0) {
        $sql .= " WHERE " . implode(" AND ", $condiciones);
    }
    $sql .= " ORDER BY fecha DESC, id DESC";

    $stmt = $conexion->prepare($sql);
    if (count($valores) > 0) {
        $stmt->bind_param($tipos, ...$valores);
    }
    $stmt->execute();
    $resultado = $stmt->get_result();

    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    if (count($datos) === 0) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "No se encontraron servicios con los filtros seleccionados."
        ]);
    } else {
        echo json_encode([
            "ok" => true,
            "datos" => $datos
        ]);
    }

    $stmt->close();
    cerrarConexion($conexion);
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al filtrar los servicios: " . $e->getMessage()
    ]);
}
?>