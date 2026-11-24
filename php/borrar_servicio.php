<?php
header('Content-Type: application/json; charset=utf-8');
require_once("config.php");

try {
    $conexion = obtenerConexion();

    // Soporta tanto FormData ($_POST) como JSON en el cuerpo de la petición
    $input = json_decode(file_get_contents("php://input"), true);
    $id = $_POST['id'] ?? $input['id'] ?? null;

    if (!$id) {
        throw new Exception("No se ha proporcionado el ID del servicio.");
    }

    $stmt = $conexion->prepare("DELETE FROM SERVICIO WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "ok" => true,
            "mensaje" => "Servicio eliminado correctamente."
        ]);
    } else {
        echo json_encode([
            "ok" => false,
            "mensaje" => "No se encontró el servicio o ya fue eliminado."
        ]);
    }

    $stmt->close();
    cerrarConexion($conexion);
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al eliminar el servicio: " . $e->getMessage()
    ]);
}
?>