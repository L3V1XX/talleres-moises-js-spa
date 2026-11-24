<?php
require_once ('config.php');

$cliente = json_decode($_POST["cliente"]);

try {
    $conexion = obtenerConexion();

    $telefono = !empty($cliente->telefono) ? "'" . $cliente->telefono . "'" : "null";
    $idCp = !empty($cliente->id_cp) ? intval($cliente->id_cp) : "null";

    $sql = "INSERT INTO CLIENTE (id, nombre_completo, telefono, email, id_cp) VALUES (null, '$cliente->nombre_completo', $telefono, '$cliente->email', $idCp)";

    $resultado = $conexion->query($sql);

    responder(null, true, "Cliente guardado en la base de datos", $conexion);

} catch (mysqli_sql_exception $e) {
    responder(null, false, "Error en la base de datos: " . $e->getMessage(), $conexion ?? null);

} catch (Exception $e) {
    responder(null, false, "Error general: " . $e->getMessage(), $conexion ?? null);
}