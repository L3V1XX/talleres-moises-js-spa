"use strict";

class Coche {
    #id;
    #matricula;
    #marca;
    #modelo;
    #anio;
    #fecha_entrada;
    #reparar;
    #id_cliente;

    constructor(id, matricula, marca, modelo, anio, fecha_entrada, reparar, id_cliente) {
        this.#id = id;
        this.#matricula = matricula;
        this.#marca = marca;
        this.#modelo = modelo;
        this.#anio = anio;
        this.#fecha_entrada = fecha_entrada;
        this.#reparar = reparar;
        this.#id_cliente = id_cliente;
    }
    get id() {
        return this.#id;
    }
    get matricula() {
        return this.#matricula;
    }
    get marca() {
        return this.#marca;
    }
    get modelo() {
        return this.#modelo;
    }
    get anio() {
        return this.#anio;
    }
    get fecha_entrada() {
        return this.#fecha_entrada;
    }
    get reparar() {
        return this.#reparar;
    }
    get id_cliente() {
        return this.#id_cliente;
    }
    set id(id) {
        this.#id = id;
    }
    set matricula(matricula) {
        this.#matricula = matricula;
    }
    set marca(marca) {
        this.#marca = marca;
    }
    set modelo(modelo) {
        this.#modelo = modelo;
    }
    set anio(anio) {
        this.#anio = anio;
    }
    set fecha_entrada(fecha_entrada) {
        this.#fecha_entrada = fecha_entrada;
    }
    set reparar(reparar) {
        this.#reparar = reparar;
    }
    set id_cliente(id_cliente) {
        this.#id_cliente = id_cliente;
    }

    toJSON() {
        return {
            id: this.#id,
            matricula: this.#matricula,
            marca: this.#marca,
            modelo: this.#modelo,
            anio: this.#anio,
            fecha_entrada: this.#fecha_entrada,
            reparar: this.#reparar,
            id_cliente: this.#id_cliente
        };
    }
}
class Servicio{
    #id;
    #fecha;
    #descripcion;
    #tiempo_estimado;
    #garantia;
    #precio_base;
    #id_reserva;
    #terminada;
    #imagen;
   
    constructor(id,fecha,descripcion,tiempo_estimado,garantia,precio_base,id_reserva,terminada,imagen) {
        this.#id = id;
        this.#fecha = fecha;
        this.#descripcion = descripcion;
        this.#tiempo_estimado = tiempo_estimado;
        this.#garantia=garantia;
        this.#precio_base=precio_base;
        this.#id_reserva=id_reserva;
        this.#terminada=terminada;
        this.#imagen=imagen;
    }
    get id() {
        return this.#id;
    }
    get fecha() {
        return this.#fecha;
    }
    get descripcion() {
        return this.#descripcion;
    }
    get tiempo_estimado() {
        return this.#tiempo_estimado;
    }
    get garantia() {
        return this.#garantia;
    }
    get precio_base() {
        return this.#precio_base;
    }
    get id_reserva() {
        return this.#id_reserva;
    }
    get terminada() {
        return this.#terminada;
    }
    get imagen() {
        return this.#imagen;
    }
    set id(id) {
        this.#id = id;
    }
    set fecha(fecha) {
        this.#fecha = fecha;
    }
    set descripcion(descripcion) {
        this.#descripcion = descripcion;
    }
    set tiempo_estimado(tiempo_estimado) {
        this.#tiempo_estimado = tiempo_estimado;
    }
    set garantia(garantia) {
        this.#garantia = garantia;
    }
    set precio_base(precio_base) {
        this.#precio_base = precio_base;
    }
    set id_reserva(id_reserva) {
        this.#id_reserva = id_reserva;
    }
    set terminada(terminada) {
        this.#terminada = terminada;
    }
    set imagen(imagen) {
        this.#imagen = imagen;
    }

   toJSON() {
        let oServicio = {
            id: this.#id,
            fecha: this.#fecha,
            descripcion: this.#descripcion,
            tiempo_estimado: this.#tiempo_estimado,
            garantia:this.#garantia,
            precio_base:this.#precio_base,
            id_reserva:this.#id_reserva,
            terminada:this.#terminada,
            imagen:this.#imagen
        };
        return oServicio;
   }
}

//--------------Coches--------------
class Empresa {
    async altaCoche(oCoche) {
        let datos = new FormData();

        datos.append("coche", JSON.stringify(oCoche));

        return await peticionPOST("alta_coche.php", datos);
    }

    async modificarCoche(oCoche) {
        let datos = new FormData();

        datos.append("coche", JSON.stringify(oCoche));

        return await peticionPOST("modificar_coche.php", datos);
    }

    async borrarCoche(idCoche) {
        let datos = new FormData();

        datos.append("id", idCoche);

        return await peticionPOST("borrar_coche.php", datos);
    }

    async buscarCoche(texto) {
        let datos = new FormData();

        datos.append("texto", texto);

        return await peticionPOST("buscar_coche.php", datos);
    }

    async listadoCoche() {
        return await peticionGET("get_coches.php");
    }

    async filtrarCoche(marca, idCliente, reparar, anioMin, anioMax) {
        let datos = new FormData();

        datos.append("marca", marca);
        datos.append("id_cliente", idCliente);
        datos.append("reparar", reparar);
        datos.append("anio_min", anioMin);
        datos.append("anio_max", anioMax);

        return await peticionPOST("filtrar_coches.php", datos);
    }

    async getCoches() {
        return await peticionGET("get_coches.php");
    }

    async getPanel() {
        return await peticionGET("get_panel.php");
    }

    async getClientes() {
        return await peticionGET("get_clientes.php");
    }

    async altaServicio(oServicio, archivoImagen = null) {
        let datos = new FormData();

        datos.append("servicio", JSON.stringify(oServicio));

        if (archivoImagen) {
            datos.append("imagen", archivoImagen);
        }
    
        let respuesta = await peticionPOST("alta_servicio.php", datos);

        return respuesta;
    }

    async modificarServicio(oServicio, archivoImagen = null) {
        let datos = new FormData();

        datos.append("servicio", JSON.stringify(oServicio));

        if (archivoImagen) {
            datos.append("imagen", archivoImagen);
        }
    
        let respuesta = await peticionPOST("modificar_servicio.php", datos);

        return respuesta;
    }

    async borrarServicio(idServicio) {

        let datos = new FormData();
        
        datos.append("id", idServicio);
    
        let respuesta = await peticionPOST("borrar_servicio.php", datos);

        return respuesta;
    }

    async buscarServicio(idServicio) {

        let datos = new FormData();
        
        datos.append("id", idServicio);
    
        let respuesta = await peticionPOST("buscar_servicio.php", datos);

        return respuesta;
    }

    async listadoServicio() {

        let datos = new FormData();
    
        let respuesta = await peticionGET("get_servicios.php", datos);

        return respuesta;
    }

    async filtrarServicio(idReserva, fechaDesde, fechaHasta, terminada) {

        let datos = new FormData();

        if (idReserva !== "") {
            datos.append("id_reserva", idReserva);
        }
        if (fechaDesde !== "") {
            datos.append("fecha_desde", fechaDesde);
        }
        if (fechaHasta !== "") {
            datos.append("fecha_hasta", fechaHasta);
        }
        if (terminada !== "") {
            datos.append("terminada", terminada);
        }
    
        let respuesta = await peticionPOST("filtrar_servicios.php", datos);

        return respuesta;
    }
    async getReservas() {
        
        let datos = new FormData();

        let respuesta = await peticionGET("get_reservas.php", datos);

        return respuesta;
    }

    async getPanel() {

        let datos = new FormData();

        let respuesta = await peticionGET("get_panel.php", datos);

        return respuesta;
    }
}
