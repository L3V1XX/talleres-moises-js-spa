<?php
require_once('config.php');
$conexion = obtenerConexion();

$id = $_GET['id'];

$sql = "SELECT * FROM CLIENTE WHERE id = $id;";

$resultado = mysqli_query($conexion, $sql);

$fila = mysqli_fetch_assoc($resultado);

if ($fila) {
    responder($fila, true, "Datos recuperados", $conexion);
} else {
    responder(null, false, "No existe el cliente", $conexion);
}