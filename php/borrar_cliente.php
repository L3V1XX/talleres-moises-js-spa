<?php
require_once('config.php');
$conexion = obtenerConexion();

$id = $_POST['id'];

$sql = "DELETE FROM CLIENTE WHERE id = $id;";

$resultado = mysqli_query($conexion, $sql);

responder(null, true, "Datos eliminados", $conexion);