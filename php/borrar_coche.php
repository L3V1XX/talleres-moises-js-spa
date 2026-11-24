<?php
header('Content-Type: application/json; charset=utf-8');
require_once("config.php");

try {
    $conexion = obtenerConexion();

    $id = intval($_POST['id'] ?? 0);
    if ($id <= 0) {
        throw new Exception("No se ha proporcionado el ID del coche.");
    }

    // Borrado lógico: se rellena deleted_at, la fila no se elimina
    // (la imagen se conserva por si el coche se recupera)
    $stmt = $conexion->prepare("UPDATE COCHE SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["ok" => true, "mensaje" => "Coche borrado correctamente."]);
    } else {
        echo json_encode(["ok" => false, "mensaje" => "No se encontró el coche o ya estaba borrado."]);
    }

    $stmt->close();
    cerrarConexion($conexion);
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al borrar el coche: " . $e->getMessage()
    ]);
}
?>
