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
}
