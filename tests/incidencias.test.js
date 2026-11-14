// Pruebas automáticas que ejecuta GitHub Actions antes de desplegar.
// Uso local: npm test
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const inc = require('../js/incidencias.js');

const base = [
  { id: 1, titulo: 'Uno', estado: 'Abierta' },
  { id: 2, titulo: 'Dos', estado: 'En proceso' },
  { id: 3, titulo: 'Tres', estado: 'Resuelta' }
];

test('valida los campos obligatorios', () => {
  const errores = inc.validarIncidencia({});
  assert.strictEqual(errores.length, 4);
});

test('crea una incidencia con id consecutivo y estado Abierta', () => {
  const nueva = inc.crearIncidencia(
    { titulo: 'Fallo al exportar', descripcion: 'No genera PDF', reportadoPor: 'Ana', prioridad: 'Alta' },
    base
  );
  assert.strictEqual(nueva.id, 4);
  assert.strictEqual(nueva.estado, 'Abierta');
});

test('rechaza una incidencia inválida', () => {
  assert.throws(() => inc.crearIncidencia({ titulo: 'x' }, base));
});

test('cambia el estado de una incidencia', () => {
  const lista = inc.cambiarEstado(base, 1, 'Resuelta');
  assert.strictEqual(lista[0].estado, 'Resuelta');
  assert.strictEqual(base[0].estado, 'Abierta');
});

test('filtra por estado "todas"', () => {
  assert.strictEqual(inc.filtrarPorEstado(base, 'todas').length, 3);
});

test('filtra por estado abierta y resuelta', () => {
  assert.deepStrictEqual(inc.filtrarPorEstado(base, 'abierta').map(i => i.id), [1]);
  assert.deepStrictEqual(inc.filtrarPorEstado(base, 'resuelta').map(i => i.id), [3]);
});

test('index.html enlaza los scripts de la aplicación', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.ok(html.includes('js/incidencias.js'));
  assert.ok(html.includes('js/app.js'));
});
