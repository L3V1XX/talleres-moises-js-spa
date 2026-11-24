<?php
header('Content-Type: application/json; charset=utf-8');
require_once("config.php");

try {
    $conexion = obtenerConexion();

    // Decodificar el objeto JSON enviado desde objetos.js en datos.append("servicio", ...)
    $servicio = json_decode($_POST['servicio'] ?? '', true);

    if (!$servicio) {
        throw new Exception("No se han recibido los datos del nuevo servicio.");
    }

    $id_reserva = $servicio['id_reserva'] ?? null;
    $precio_base = $servicio['precio_base'] ?? 0;
    $fecha = $servicio['fecha'] ?? '';
    $garantia = trim($servicio['garantia'] ?? '');
    $garantia = ($garantia === '') ? null : $garantia;
    $descripcion = $servicio['descripcion'] ?? '';
    $tiempo_estimado = intval($servicio['tiempo_estimado'] ?? 0);
    $terminada = !empty($servicio['terminada']) ? 1 : 0;

    if (!$id_reserva || $fecha === '' || $descripcion === '') {
        throw new Exception("Faltan campos obligatorios para dar de alta el servicio.");
    }

    // Comprobar si se ha subido una imagen
    $nombreImagen = null;
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $permitidos = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($_FILES['imagen']['type'], $permitidos)) {
            throw new Exception("Formato de imagen no permitido (solo JPG, PNG o WEBP).");
        }
        if ($_FILES['imagen']['size'] > 2 * 1024 * 1024) {
            throw new Exception("La imagen supera el tamaño máximo de 2 MB.");
        }

        $ext = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
        $nombreImagen = "servicio_" . time() . "_" . rand(100, 999) . "." . $ext;
        $destino = "../img/servicios/" . $nombreImagen;

        if (!is_dir("../img/servicios/")) {
            mkdir("../img/servicios/", 0777, true);
        }

        if (!move_uploaded_file($_FILES['imagen']['tmp_name'], $destino)) {
            throw new Exception("Error al guardar la imagen en el servidor.");
        }
    }

    $sql = "INSERT INTO SERVICIO (fecha, descripcion, tiempo_estimado, garantia, precio_base, id_reserva, terminada, imagen) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("ssisdiis", $fecha, $descripcion, $tiempo_estimado, $garantia, $precio_base, $id_reserva, $terminada, $nombreImagen);
    $stmt->execute();

    echo json_encode([
        "ok" => true,
        "mensaje" => "Servicio dado de alta correctamente."
    ]);

    $stmt->close();
    cerrarConexion($conexion);
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al dar de alta el servicio: " . $e->getMessage()
    ]);
}
?>