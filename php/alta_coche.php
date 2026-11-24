<?php
header('Content-Type: application/json; charset=utf-8');
require_once("config.php");

try {
    $conexion = obtenerConexion();

    // Objeto JSON enviado desde objetos.js en datos.append("coche", ...)
    $coche = json_decode($_POST['coche'] ?? '', true);

    if (!$coche) {
        throw new Exception("No se han recibido los datos del coche.");
    }

    $matricula = trim($coche['matricula'] ?? '');
    $marca = trim($coche['marca'] ?? '');
    $modelo = trim($coche['modelo'] ?? '');
    $anio = intval($coche['anio'] ?? 0);
    $fechaEntrada = trim($coche['fecha_entrada'] ?? '');
    $reparar = !empty($coche['reparar']) ? 1 : 0;
    $idCliente = intval($coche['id_cliente'] ?? 0);

    // El required del HTML no basta: se valida también en el servidor
    if ($matricula === '' || $marca === '' || $modelo === '' || $fechaEntrada === '' || $idCliente <= 0) {
        throw new Exception("Faltan campos obligatorios para dar de alta el coche.");
    }
    if ($anio < 1900 || $anio > intval(date("Y"))) {
        throw new Exception("El año debe estar entre 1900 y " . date("Y") . ".");
    }

    // ¿Existe ya esa matrícula (activa o borrada lógicamente)?
    $stmt = $conexion->prepare("SELECT id, deleted_at FROM COCHE WHERE matricula = ?");
    $stmt->bind_param("s", $matricula);
    $stmt->execute();
    $existente = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($existente == null) {
        $stmt = $conexion->prepare("INSERT INTO COCHE (fecha_entrada, reparar, marca, modelo, matricula, anio, id_cliente)
                                    VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sisssii", $fechaEntrada, $reparar, $marca, $modelo, $matricula, $anio, $idCliente);
        $mensaje = "Coche dado de alta correctamente.";
    } elseif ($existente["deleted_at"] == null) {
        throw new Exception("ya existe un coche con esa matrícula.");
    } else {
        // Estaba borrado: se restaura con los datos nuevos
        $stmt = $conexion->prepare("UPDATE COCHE SET deleted_at = NULL, fecha_entrada = ?, reparar = ?, marca = ?,
                                    modelo = ?, anio = ?, id_cliente = ? WHERE id = ?");
        $stmt->bind_param("sissiii", $fechaEntrada, $reparar, $marca, $modelo, $anio, $idCliente, $existente["id"]);
        $mensaje = "El coche estaba borrado y se ha restaurado con los datos nuevos.";
    }
    $stmt->execute();

    echo json_encode([
        "ok" => true,
        "mensaje" => $mensaje
    ]);

    $stmt->close();
    cerrarConexion($conexion);
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al dar de alta el coche: " . $e->getMessage()
    ]);
}
?>
