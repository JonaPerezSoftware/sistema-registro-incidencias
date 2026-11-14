# Sistema de Registro de Incidencias

Aplicación web sencilla para **registrar, listar y filtrar incidencias** reportadas por los usuarios de una empresa de software. El proyecto se usa para practicar la **gestión de la configuración del software**: control de versiones con Git, ramas y pull requests, versionamiento semántico, releases y despliegue continuo con GitHub Actions y GitHub Pages.

**Aplicación publicada:** https://jonaperezsoftware.github.io/sistema-registro-incidencias/

## Funcionalidades

| Versión | Cambios |
|---|---|
| `v1.0.0` | Registro de incidencias (título, descripción, quién reporta, prioridad) y listado con cambio de estado. |
| `v1.1.0` | Filtro de incidencias por estado (Todas, Abierta, En proceso, Resuelta) y contador de resultados. |
| `v1.1.1` | Corrección: el filtro "En proceso" no mostraba resultados (issue #4). |

## Estructura del proyecto

```
├── index.html                 # Interfaz de la aplicación
├── css/styles.css             # Estilos
├── js/incidencias.js          # Lógica de negocio (validar, crear, cambiar estado, filtrar)
├── js/app.js                  # Conexión de la lógica con la interfaz
├── tests/incidencias.test.js  # Pruebas automáticas (node:test)
├── package.json               # Script "npm test"
└── .github/workflows/deploy.yml  # Pipeline: validar y desplegar en GitHub Pages
```

## Cómo ejecutarlo

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/JonaPerezSoftware/sistema-registro-incidencias.git
   cd sistema-registro-incidencias
   ```
2. Abrir `index.html` en el navegador (doble clic) o levantar un servidor local:
   ```bash
   npx serve .
   ```
3. Ejecutar las pruebas (requiere Node.js 18 o superior):
   ```bash
   npm test
   ```

Las incidencias se guardan en el `localStorage` del navegador.

## Flujo de trabajo del equipo

- `main` contiene siempre la versión estable y desplegada.
- Cada cambio se hace en una rama (`feature/...`, `fix/...`, `ci/...`) y se integra mediante **pull request**.
- Al integrar en `main`, GitHub Actions ejecuta las pruebas y, si pasan, publica la aplicación en GitHub Pages.
- Las versiones siguen **versionamiento semántico** `MAJOR.MINOR.PATCH` y se publican como releases en GitHub.

## Asignatura

Gestión de la Configuración del Software · Unidad 3: Gestión de la construcción y despliegue continuo · Tema 3: Despliegue continuo.
