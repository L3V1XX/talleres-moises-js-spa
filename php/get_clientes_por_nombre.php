<?php
require_once ('config.php');
try {
    $conexion = obtenerConexion();

    $nombre = $_GET["nombre"];

    $sql = "SELECT * FROM CLIENTE WHERE nombre_completo LIKE '$nombre'";

    $resultado = $conexion->query($sql);

    $datos = [];

    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    responder($datos, true, "Datos recuperados correctamente", $conexion);

} catch (mysqli_sql_exception $e) {
    responder(null, false, "Error en la base de datos: " . $e->getMessage(), $conexion ?? null);
} catch (Exception $e) {
    responder(null, false, "Error general: " . $e->getMessage(), $conexion ?? null);
}