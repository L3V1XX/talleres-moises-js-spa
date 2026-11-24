<?php
header('Content-Type: application/json; charset=utf-8');
require_once("config.php");

try {
    $conexion = obtenerConexion();

    // Número de registros activos de cada tabla (CLIENTE y COCHE tienen borrado lógico)
    $consultas = [
        "clientes"  => "SELECT COUNT(*) AS n FROM CLIENTE WHERE deleted_at IS NULL",
        "coches"    => "SELECT COUNT(*) AS n FROM COCHE WHERE deleted_at IS NULL",
        "reservas"  => "SELECT COUNT(*) AS n FROM RESERVA",
        "servicios" => "SELECT COUNT(*) AS n FROM SERVICIO"
    ];

    $cuentas = [];
    foreach ($consultas as $clave => $sql) {
        $fila = $conexion->query($sql)->fetch_assoc();
        $cuentas[$clave] = (int)$fila["n"];
    }

    // Próximas 6 reservas desde hoy.
    // LEFT JOIN + snapshots: la reserva se conserva aunque el coche se haya borrado (id_coche NULL).
    $sql = "SELECT r.id, r.dia, r.franja_horaria,
                   r.snapshot_coche_matricula AS matricula,
                   CONCAT(co.marca, ' ', co.modelo) AS vehiculo,
                   COALESCE(cl.nombre_completo, r.snapshot_cliente_email) AS cliente
            FROM RESERVA r
            LEFT JOIN COCHE co ON co.id = r.id_coche
            LEFT JOIN CLIENTE cl ON cl.id = co.id_cliente
            WHERE r.dia >= CURDATE()
            ORDER BY r.dia, FIELD(r.franja_horaria, 'MANANA', 'TARDE')
            LIMIT 6";
    $resultado = $conexion->query($sql);

    $proximas = [];
    while ($fila = $resultado->fetch_assoc()) {
        $proximas[] = $fila;
    }

    cerrarConexion($conexion);

    echo json_encode([
        "ok" => true,
        "mensaje" => "Panel recuperado correctamente",
        "datos" => ["cuentas" => $cuentas, "proximas" => $proximas]
    ]);
} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "mensaje" => "Error al obtener el panel: " . $e->getMessage(),
        "datos" => null
    ]);
}
?>
