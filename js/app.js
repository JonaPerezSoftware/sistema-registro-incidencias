/**
 * Interfaz del Sistema de Registro de Incidencias.
 * Conecta el formulario y la tabla con la lógica de js/incidencias.js.
 */
(function () {
  'use strict';

  const CLAVE = 'incidencias.v1';
  const { crearIncidencia, cambiarEstado, filtrarPorEstado, validarIncidencia, ESTADOS } = window.Incidencias;

  const EJEMPLOS = [
    { id: 1, titulo: 'No carga el reporte mensual', descripcion: 'Al abrir el reporte aparece una pantalla en blanco.', reportadoPor: 'Ana Torres', prioridad: 'Alta', estado: 'Abierta', fecha: '2026-11-10T14:05:00.000Z' },
    { id: 2, titulo: 'Error al iniciar sesión', descripcion: 'El sistema rechaza contraseñas con tildes.', reportadoPor: 'Luis Mora', prioridad: 'Media', estado: 'En proceso', fecha: '2026-11-11T09:30:00.000Z' },
    { id: 3, titulo: 'Botón Guardar desalineado', descripcion: 'En pantallas pequeñas el botón queda fuera del formulario.', reportadoPor: 'María Vera', prioridad: 'Baja', estado: 'Resuelta', fecha: '2026-11-12T16:45:00.000Z' }
  ];

  function cargar() {
    try {
      const guardado = localStorage.getItem(CLAVE);
      return guardado ? JSON.parse(guardado) : EJEMPLOS.slice();
    } catch (e) {
      return EJEMPLOS.slice();
    }
  }

  function guardar(lista) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(lista));
    } catch (e) {
      /* Sin almacenamiento disponible: los datos viven solo en memoria. */
    }
  }

  let incidencias = cargar();

  const form = document.getElementById('form-incidencia');
  const errores = document.getElementById('errores');
  const cuerpo = document.getElementById('cuerpo-tabla');
  const filtro = document.getElementById('filtro-estado');
  const contador = document.getElementById('contador');

  function escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }

  function claseEstado(estado) {
    return 'estado estado-' + estado.toLowerCase().replace(/\s+/g, '-');
  }

  function render() {
    const visibles = filtrarPorEstado(incidencias, filtro.value);
    contador.textContent = 'Mostrando ' + visibles.length + ' de ' + incidencias.length + ' incidencias';

    if (!visibles.length) {
      cuerpo.innerHTML = '<tr><td colspan="6" class="vacio">No hay incidencias para mostrar.</td></tr>';
      return;
    }

    cuerpo.innerHTML = visibles.map(i => `
      <tr>
        <td>#${i.id}</td>
        <td><strong>${escapar(i.titulo)}</strong><br><small>${escapar(i.descripcion)}</small></td>
        <td>${escapar(i.reportadoPor)}</td>
        <td><span class="prioridad prioridad-${i.prioridad.toLowerCase()}">${i.prioridad}</span></td>
        <td>
          <select data-id="${i.id}" class="${claseEstado(i.estado)}" aria-label="Estado de la incidencia ${i.id}">
            ${ESTADOS.map(e => `<option ${e === i.estado ? 'selected' : ''}>${e}</option>`).join('')}
          </select>
        </td>
        <td>${new Date(i.fecha).toLocaleDateString('es-EC')}</td>
      </tr>`).join('');
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    const datos = Object.fromEntries(new FormData(form));
    const problemas = validarIncidencia(datos);
    if (problemas.length) {
      errores.innerHTML = problemas.map(p => '<li>' + p + '</li>').join('');
      errores.hidden = false;
      return;
    }
    errores.hidden = true;
    incidencias = incidencias.concat(crearIncidencia(datos, incidencias));
    guardar(incidencias);
    form.reset();
    render();
  });

  cuerpo.addEventListener('change', function (evento) {
    const select = evento.target;
    if (select.matches('select[data-id]')) {
      incidencias = cambiarEstado(incidencias, Number(select.dataset.id), select.value);
      guardar(incidencias);
      render();
    }
  });

  filtro.addEventListener('change', render);

  render();
})();
