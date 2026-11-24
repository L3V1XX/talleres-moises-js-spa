"use strict";

var oEmpresa = new Empresa();

// >>> CLIENTES (Javier): variables globales aquí

// >>> COCHES
var idCochePendienteBorrar = null;
var cochesMostrados = [];

// >>> RESERVAS (Carmen): variables globales aquí

// >>> SERVICIOS (Moises): variables globales aquí

registrarEventos();
mostrarInicio();

// =============================================================================
// 2. REGISTRO DE EVENTOS
// =============================================================================
function registrarEventos() {
  // Inicio (logo y opción del menú)
  document.querySelector("#mnuInicio").addEventListener("click", mostrarInicio);
  document.querySelector("#mnuLogo").addEventListener("click", mostrarInicio);

  // >>> CLIENTES (Javier): eventos del menú (#mnu...Cliente) y de sus formularios/botones aquí

  // >>> COCHES
  document
    .querySelector("#mnuAltaCoche")
    .addEventListener("click", mostrarFormulario);
  document
    .querySelector("#mnuBuscarCoche")
    .addEventListener("click", mostrarFormulario);
  document
    .querySelector("#mnuListarCoche")
    .addEventListener("click", mostrarFormulario);
  document
    .querySelector("#mnuFiltrarCoche")
    .addEventListener("click", mostrarFormulario);

  frmAltaCoche.addEventListener("submit", procesarGuardarCoche);
  // Tras el reset nativo del botón, la fecha de entrada vuelve a ser hoy
  document
    .querySelector("#btnReiniciarCoche")
    .addEventListener("click", () => setTimeout(prepararAltaCoche, 0));
  document
    .querySelector("#btnCancelarCoche")
    .addEventListener("click", () => {
      resetearFormularioCoche();
      ocultarFormularios();
      vistaListarCoche.classList.remove("d-none");
      procesarListadoCoches();
    });
  frmBuscarCoche.addEventListener("submit", procesarBuscarCoches);
  frmFiltroCoches.addEventListener("submit", procesarFiltrarCoches);
  frmFiltroCoches.addEventListener("reset", () => {
    document.querySelector("#resultadosCoches").innerHTML = "";
  });

  // >>> RESERVAS (Carmen): eventos del menú (#mnu...Reserva) y de sus formularios/botones aquí

  // >>> SERVICIOS (Moises): eventos del menú (#mnu...Servicio) y de sus formularios/botones aquí

  // COMPARTIDO: confirmación de borrado en el modal de Bootstrap (un único botón para todos)
  document
    .querySelector("#btnConfirmarBorrarDefinitivo")
    .addEventListener("click", ejecutarBorrado);

  // COMPARTIDO: año máximo = año actual en los campos de año
  for (let campo of document.querySelectorAll(".campo-anio")) {
    campo.max = new Date().getFullYear();
  }
}

// =============================================================================
// 3. MOSTRAR FORMULARIO (según la opción de menú pulsada)
// =============================================================================
function mostrarFormulario(oEvento) {
  oEvento.preventDefault();
  let opcionMenu = oEvento.currentTarget.id;

  ocultarFormularios();

  switch (opcionMenu) {
    // >>> CLIENTES (Javier): cases mnuAltaCliente, mnuBuscarCliente, mnuListarCliente, mnuFiltrarCliente

    // >>> COCHES
    case "mnuAltaCoche":
      resetearFormularioCoche();
      vistaAltaCoche.classList.remove("d-none");
      actualizarDesplegableClientes();
      break;
    case "mnuBuscarCoche":
      vistaBuscarCoche.classList.remove("d-none");
      break;
    case "mnuListarCoche":
      vistaListarCoche.classList.remove("d-none");
      procesarListadoCoches();
      break;
    case "mnuFiltrarCoche":
      vistaFiltrarCoche.classList.remove("d-none");
      actualizarDesplegableClientes();
      break;

    // >>> RESERVAS (Carmen): cases mnuAltaReserva, mnuBuscarReserva, mnuListarReserva, mnuFiltrarReserva

    // >>> SERVICIOS (Moises): cases mnuAltaServicio, mnuBuscarServicio, mnuListarServicio, mnuFiltrarServicio
  }
}

// =============================================================================
// 4. OCULTAR FORMULARIOS (poner "d-none" a todas las vistas antes de mostrar una)
// =============================================================================
function ocultarFormularios() {
  vistaInicio.classList.add("d-none");

  // >>> CLIENTES (Javier): ocultar tus vistas y vaciar #resultadosClientes

  // >>> COCHES
  vistaAltaCoche.classList.add("d-none");
  vistaBuscarCoche.classList.add("d-none");
  vistaListarCoche.classList.add("d-none");
  vistaFiltrarCoche.classList.add("d-none");
  document.querySelector("#resultadosCoches").innerHTML = "";

  // >>> RESERVAS (Carmen): ocultar tus vistas y vaciar tus resultados

  // >>> SERVICIOS (Moises): ocultar tus vistas y vaciar #resultadosServicios
}

// =============================================================================
// 5. FUNCIONES COMPARTIDAS (no las modifiques sin avisar al grupo)
// =============================================================================

// Escapa texto antes de meterlo en innerHTML
function esc(texto) {
  const d = document.createElement("div");
  d.textContent = texto ?? "";
  return d.innerHTML;
}

function mostrarInicio(oEvento) {
  if (oEvento) oEvento.preventDefault();
  ocultarFormularios();
  vistaInicio.classList.remove("d-none");
  // TODO (grupo): pintar el panel de inicio (contadores y próximas reservas) con oEmpresa.getPanel()
}

// El mismo botón del modal sirve para confirmar el borrado de cualquier entidad.
// Cada compañero añade aquí su "if (idXxxPendienteBorrar) return ejecutarBorradoXxx();"
function ejecutarBorrado() {
  // >>> CLIENTES (Javier): if (idClientePendienteBorrar) return ejecutarBorradoCliente();
  if (idCochePendienteBorrar) {
    return ejecutarBorradoCoche();
  }
  // >>> RESERVAS (Carmen): if (idReservaPendienteBorrar) return ejecutarBorradoReserva();
  // >>> SERVICIOS (Moises): if (idServicioPendienteBorrar) return ejecutarBorradoServicio();
}

function mostrarToast(mensaje, esExito = true) {
  const toastEl = document.querySelector("#toastNotificacion");

  document.querySelector("#toastMensaje").textContent = mensaje;
  document.querySelector("#toastTitulo").textContent = esExito
    ? "Operación correcta"
    : "Ha ocurrido un error";

  // Color del borde lateral e icono según el resultado
  toastEl.classList.remove("toast-exito", "toast-error");
  toastEl.classList.add(esExito ? "toast-exito" : "toast-error");
  document.querySelector("#toastIcono").className =
    "bi fs-4 toast-taller-icono " +
    (esExito ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill");

  bootstrap.Toast.getOrCreateInstance(toastEl).show();
}

// =============================================================================
// >>> CLIENTES (Javier): TUS FUNCIONES VAN AQUÍ
//     Sugerido: pintarTablaClientes, procesarListadoClientes, procesarBuscarClientes,
//     procesarFiltrarClientes, ejecutarBorradoCliente, procesarGuardarCliente...
//     Además, tu desplegable de clientes debe exponer oEmpresa.getClientes()
//     porque el formulario de COCHES lo usa para elegir el dueño del coche.
// =============================================================================

// =============================================================================
// >>> COCHES (Jose Manuel)
// =============================================================================

// Rellena los desplegables de clientes (alta/edición y filtro de coches)
// DEPENDE de oEmpresa.getClientes() (parte de Javier / Clientes)
async function actualizarDesplegableClientes(idClienteSeleccionado) {
  let respuesta = await oEmpresa.getClientes();

  let optionsAlta = "<option value=''>-- Seleccione cliente --</option>";
  let optionsFiltro = "<option value=''>-- Todos los clientes --</option>";

  if (respuesta.ok && Array.isArray(respuesta.datos)) {
    for (let cliente of respuesta.datos) {
      let opcion =
        "<option value='" + cliente.id + "'%SEL%>" + esc(cliente.nombre_completo) + "</option>";
      let sel = idClienteSeleccionado == cliente.id ? " selected" : "";
      optionsAlta += opcion.replace("%SEL%", sel);
      optionsFiltro += opcion.replace("%SEL%", "");
    }
  } else {
    mostrarToast(respuesta.mensaje, false);
  }

  // Se conserva el cliente elegido en el filtro si ya había uno
  let filtroActual = frmFiltroCoches.lstClienteFiltro.value;
  frmAltaCoche.lstClienteCoche.innerHTML = optionsAlta;
  frmFiltroCoches.lstClienteFiltro.innerHTML = optionsFiltro;
  frmFiltroCoches.lstClienteFiltro.value = filtroActual;
}

function fechaHoy() {
  let hoy = new Date();
  let mes = String(hoy.getMonth() + 1).padStart(2, "0");
  let dia = String(hoy.getDate()).padStart(2, "0");
  return hoy.getFullYear() + "-" + mes + "-" + dia;
}

// Deja el formulario en modo "Alta" (sin limpiar los campos: eso lo hace reset)
function prepararAltaCoche() {
  document.querySelector("#id_coche").value = "";
  document.querySelector("#tituloFormularioCoche").textContent = "Alta de coche";
  document.querySelector("#iconoTituloCoche").className = "bi bi-car-front";
  document.querySelector("#btnAceptarAltaCoche span").textContent = "Aceptar";
  document.querySelector("#colReiniciarCoche").classList.remove("d-none");
  document.querySelector("#colCancelarCoche").classList.add("d-none");
  document.querySelector("#txtFechaEntrada").value = fechaHoy();
}

function resetearFormularioCoche() {
  frmAltaCoche.reset();
  prepararAltaCoche();
}

// HTML de una tabla de coches
function pintarTablaCoches(datos, mensajeVacio, mostrarTotal) {
  cochesMostrados = datos;
  let cont = document.querySelector("#resultadosCoches");

  if (datos.length === 0) {
    cont.innerHTML = "<div class='alert alert-info'>" + mensajeVacio + "</div>";
    return;
  }

  let html = "";
  if (mostrarTotal) {
    html +=
      "<p class='text-muted'>" + datos.length + " coche(s) encontrado(s)</p>";
  }

  html +=
    "<div class='table-responsive'><table class='table table-striped table-hover align-middle' id='tablaListadoCoches'>" +
    "<thead><tr>" +
    "<th>Matrícula</th><th>Marca</th><th>Modelo</th><th>Año</th>" +
    "<th>Fecha de entrada</th><th>Reparar</th><th>Cliente</th><th>Acciones</th>" +
    "</tr></thead><tbody>";

  for (let fila of datos) {
    let cliente = fila.nombre_completo
      ? esc(fila.nombre_completo)
      : "<span class='text-muted'>Sin cliente</span>";

    let reparar =
      fila.reparar == 1
        ? "<span class='badge text-bg-warning'>Sí</span>"
        : "<span class='badge text-bg-secondary'>No</span>";

    html +=
      "<tr>" +
      "<td class='fw-semibold'>" + esc(fila.matricula) + "</td>" +
      "<td>" + esc(fila.marca) + "</td>" +
      "<td>" + esc(fila.modelo) + "</td>" +
      "<td>" + esc(String(fila.anio)) + "</td>" +
      "<td>" + esc(fila.fecha_entrada) + "</td>" +
      "<td>" + reparar + "</td>" +
      "<td>" + cliente + "</td>" +
      "<td class='text-nowrap'>" +
      "<button type='button' class='btn btn-sm btn-outline-primary me-1 btn-editar-coche' data-id='" +
      fila.id +
      "' title='Editar'><i class='bi bi-pencil'></i></button>" +
      "<button type='button' class='btn btn-sm btn-outline-danger btn-eliminar-coche' data-id='" +
      fila.id +
      "' data-matricula='" +
      esc(fila.matricula) +
      "' title='Borrar'><i class='bi bi-trash'></i></button>" +
      "</td></tr>";
  }

  html += "</tbody></table></div>";
  cont.innerHTML = html;

  cont
    .querySelector("#tablaListadoCoches")
    .addEventListener("click", procesarAccionTablaCoches);
}

// Botón "Nuevo coche" bajo el listado
function pieListadoCoches() {
  document.querySelector("#resultadosCoches").insertAdjacentHTML(
    "beforeend",
    "<button type='button' class='btn btn-secondary px-4 fw-semibold mb-4' id='btnNuevoCoche'>" +
      "<i class='bi bi-plus-lg me-1' aria-hidden='true'></i> Nuevo coche</button>",
  );
  document
    .querySelector("#btnNuevoCoche")
    .addEventListener("click", () => document.querySelector("#mnuAltaCoche").click());
}

async function procesarListadoCoches() {
  let respuesta = await oEmpresa.listadoCoche();

  if (!respuesta.ok) {
    document.querySelector("#resultadosCoches").innerHTML =
      "<div class='alert alert-warning'>" + esc(respuesta.mensaje) + "</div>";
    return;
  }

  pintarTablaCoches(respuesta.datos, "No hay coches registrados.", false);
  pieListadoCoches();
}

async function procesarBuscarCoches(oEvento) {
  oEvento.preventDefault();

  let texto = frmBuscarCoche.txtBuscarCoche.value.trim();
  let respuesta = await oEmpresa.buscarCoche(texto);

  if (!respuesta.ok) {
    document.querySelector("#resultadosCoches").innerHTML =
      "<div class='alert alert-warning'>" + esc(respuesta.mensaje) + "</div>";
    return;
  }

  pintarTablaCoches(respuesta.datos, "No se han encontrado coches.", true);
}

async function procesarFiltrarCoches(oEvento) {
  oEvento.preventDefault();

  let respuesta = await oEmpresa.filtrarCoche(
    frmFiltroCoches.txtMarcaFiltro.value.trim(),
    frmFiltroCoches.lstClienteFiltro.value,
    frmFiltroCoches.lstRepararFiltro.value,
    frmFiltroCoches.txtAnioMin.value,
    frmFiltroCoches.txtAnioMax.value,
  );

  if (!respuesta.ok) {
    document.querySelector("#resultadosCoches").innerHTML =
      "<div class='alert alert-warning'>" + esc(respuesta.mensaje) + "</div>";
    return;
  }

  pintarTablaCoches(
    respuesta.datos,
    "No hay coches que cumplan los filtros.",
    true,
  );
}

function procesarAccionTablaCoches(oEvento) {
  let btnEditar = oEvento.target.closest(".btn-editar-coche");
  let btnEliminar = oEvento.target.closest(".btn-eliminar-coche");

  if (btnEditar) {
    let coche = cochesMostrados.find((c) => c.id == btnEditar.dataset.id);
    if (coche) cargarFormularioEdicionCoche(coche);
  } else if (btnEliminar) {
    idCochePendienteBorrar = btnEliminar.dataset.id;

    document.querySelector("#mensajeModalBorrar").textContent =
      "¿Seguro que quieres borrar el coche " + btnEliminar.dataset.matricula + "?";
    bootstrap.Modal.getOrCreateInstance(
      document.querySelector("#modalConfirmarBorrar"),
    ).show();
  }
}

async function ejecutarBorradoCoche() {
  if (!idCochePendienteBorrar) return;

  bootstrap.Modal.getOrCreateInstance(
    document.querySelector("#modalConfirmarBorrar"),
  ).hide();

  let respuesta = await oEmpresa.borrarCoche(idCochePendienteBorrar);
  idCochePendienteBorrar = null;

  mostrarToast(respuesta.mensaje, respuesta.ok);

  if (respuesta.ok) {
    ocultarFormularios();
    vistaListarCoche.classList.remove("d-none");
    procesarListadoCoches();
  }
}

async function cargarFormularioEdicionCoche(coche) {
  ocultarFormularios();
  resetearFormularioCoche();
  vistaAltaCoche.classList.remove("d-none");

  document.querySelector("#tituloFormularioCoche").textContent = "Editar coche";
  document.querySelector("#iconoTituloCoche").className = "bi bi-pencil-square";
  document.querySelector("#btnAceptarAltaCoche span").textContent = "Guardar cambios";
  document.querySelector("#colReiniciarCoche").classList.add("d-none");
  document.querySelector("#colCancelarCoche").classList.remove("d-none");

  await actualizarDesplegableClientes(coche.id_cliente);

  document.querySelector("#id_coche").value = coche.id;
  document.querySelector("#txtMatricula").value = coche.matricula;
  document.querySelector("#txtAnio").value = coche.anio;
  document.querySelector("#txtMarca").value = coche.marca;
  document.querySelector("#txtModelo").value = coche.modelo;
  document.querySelector("#txtFechaEntrada").value = coche.fecha_entrada;
  document.querySelector("#chkReparar").checked = coche.reparar == 1;
}

// Sirve tanto para Alta (id vacío) como para Edición (id con valor)
async function procesarGuardarCoche(oEvento) {
  oEvento.preventDefault();

  let id = document.querySelector("#id_coche").value.trim();

  let oCoche = new Coche(
    id !== "" ? parseInt(id) : null,
    document.querySelector("#txtMatricula").value.trim(),
    document.querySelector("#txtMarca").value.trim(),
    document.querySelector("#txtModelo").value.trim(),
    parseInt(document.querySelector("#txtAnio").value),
    document.querySelector("#txtFechaEntrada").value,
    document.querySelector("#chkReparar").checked ? 1 : 0,
    parseInt(document.querySelector("#lstClienteCoche").value),
  );

  let respuesta;
  if (id !== "") {
    respuesta = await oEmpresa.modificarCoche(oCoche);
  } else {
    respuesta = await oEmpresa.altaCoche(oCoche);
  }

  mostrarToast(respuesta.mensaje, respuesta.ok);

  if (respuesta.ok) {
    resetearFormularioCoche();
    ocultarFormularios();
    vistaListarCoche.classList.remove("d-none");
    procesarListadoCoches();
  }
}

// =============================================================================
// >>> RESERVAS (Carmen): TUS FUNCIONES VAN AQUÍ
//     Sugerido: desplegable de coches, pintarTablaReservas, procesarListadoReservas,
//     procesarBuscarReservas, procesarFiltrarReservas, ejecutarBorradoReserva,
//     procesarGuardarReserva...
//     Moises necesita oEmpresa.getReservas() para el desplegable de sus servicios.
// =============================================================================

// =============================================================================
// >>> SERVICIOS (Moises): TUS FUNCIONES VAN AQUÍ
//     Sugerido: pintarTablaServicios, procesarListadoServicios, procesarBuscarServicios,
//     procesarFiltrarServicios, ejecutarBorradoServicio, procesarGuardarServicio...
// =============================================================================
