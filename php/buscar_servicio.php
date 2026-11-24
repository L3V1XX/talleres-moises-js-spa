<?php
header('Content-Type: application/json; charset=utf-8');
require_once("config.php");

try {
    $conexion = obtenerConexion();

    $id = intval($_POST['id'] ?? 0);
    if (!$id) {
        throw new Exception("Debe seleccionar un servicio válido.");
    }

    $sql = "SELECT * FROM SERVICIO WHERE id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    if (count($datos) === 0) {
        echo json_encode([
            "ok" => false,
            "mensaje" => "No se ha encontrado ningún servicio con ID #" . $id
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
        "mensaje" => "Error al buscar el servicio: " . $e->getMessage()
    ]);
}
?>