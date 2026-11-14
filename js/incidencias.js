/**
 * Lógica de negocio del Sistema de Registro de Incidencias.
 * No depende del navegador, por eso se puede probar con Node.js.
 */
(function (global) {
  'use strict';

  const ESTADOS = ['Abierta', 'En proceso', 'Resuelta'];
  const PRIORIDADES = ['Baja', 'Media', 'Alta'];

  /** Devuelve una lista de mensajes de error; vacía si los datos son válidos. */
  function validarIncidencia(datos) {
    const errores = [];
    if (!datos || !String(datos.titulo || '').trim()) {
      errores.push('El título es obligatorio.');
    } else if (String(datos.titulo).trim().length < 5) {
      errores.push('El título debe tener al menos 5 caracteres.');
    }
    if (!datos || !String(datos.descripcion || '').trim()) {
      errores.push('La descripción es obligatoria.');
    }
    if (!datos || !String(datos.reportadoPor || '').trim()) {
      errores.push('Indique quién reporta la incidencia.');
    }
    if (!datos || !PRIORIDADES.includes(datos.prioridad)) {
      errores.push('Seleccione una prioridad válida.');
    }
    return errores;
  }

  /** Crea una nueva incidencia con id consecutivo, fecha actual y estado "Abierta". */
  function crearIncidencia(datos, lista) {
    const errores = validarIncidencia(datos);
    if (errores.length) {
      throw new Error(errores.join(' '));
    }
    const ultimoId = lista.reduce((max, i) => Math.max(max, i.id), 0);
    return {
      id: ultimoId + 1,
      titulo: String(datos.titulo).trim(),
      descripcion: String(datos.descripcion).trim(),
      reportadoPor: String(datos.reportadoPor).trim(),
      prioridad: datos.prioridad,
      estado: 'Abierta',
      fecha: new Date().toISOString()
    };
  }

  /** Devuelve una copia de la lista con el estado de la incidencia actualizado. */
  function cambiarEstado(lista, id, nuevoEstado) {
    if (!ESTADOS.includes(nuevoEstado)) {
      throw new Error('Estado no válido: ' + nuevoEstado);
    }
    return lista.map(i => (i.id === id ? Object.assign({}, i, { estado: nuevoEstado }) : i));
  }

  const api = {
    ESTADOS,
    PRIORIDADES,
    validarIncidencia,
    crearIncidencia,
    cambiarEstado
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.Incidencias = api;
  }
})(this);
