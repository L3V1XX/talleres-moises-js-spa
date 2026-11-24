<?php
// Códigos postales para rellenar los desplegables de clientes
require_once("config.php");

try {
    $conexion = obtenerConexion();

    $resultado = $conexion->query("SELECT id, codigo, municipio FROM CODIGO_POSTAL ORDER BY codigo, municipio");

    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    responder($datos, true, "Códigos postales recuperados correctamente", $conexion);
} catch (Exception $e) {
    responder(null, false, "Error al obtener los códigos postales: " . $e->getMessage(), $conexion ?? null);
}
