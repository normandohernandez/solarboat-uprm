# Sitio web — UPRM Solar Boat Team

Sitio estático de varias páginas. No hay build ni dependencias: se abre `index.html` y ya.

## Estructura

```
web/frontend/
  index.html          Inicio (portada, estadísticas, fotos clave y redes)
  sobre.html          Sobre nosotros
  team.html           Resumen de divisiones y liderazgo
  team-*.html         Página de miembros de cada división
  logros.html         Logros
  noticias.html       Noticias
  eventos.html        Eventos
  donar.html          Donar
  unete.html          Únete al equipo
  fotos.html          Galería
  contacto.html       Contacto
  fotos/              Las fotos reales van aquí (lee fotos/README.md)
  css/
    tokens.css        Colores, tipografía y espaciado. Empieza aquí para recolorear el sitio.
    base.css          Reset y estilos base
    utilities.css     Piezas compartidas: .container, .btn, .tag, .section-heading
    nav.css           Barra de navegación y menú móvil
    footer.css        Pie de página
    animations.css    Aparición al hacer scroll (.reveal)
    sections/         Un archivo por sección (home.css = fotos clave del inicio)
    responsive.css    Todos los @media juntos
  js/
    layout.js         Menú, patrocinadores y pie de página de TODAS las páginas
    events-config.js  Datos de anuncios y eventos destacados
    event-system.js   Selección, fechas, prioridades y cooldown de eventos
    event-popup.js    Renderizado y accesibilidad del popup
    team-data.js      Fuente central de divisiones y miembros
    team-page.js      Genera tarjetas, conteos y páginas de división
    api.js            Contacto con el backend. Aquí está API_BASE.
    nav.js            Menú móvil
    reveal.js         Animación de scroll
    gallery.js        Filtros y visor de fotos
    forms.js          Formularios de reclutamiento, eventos y contacto
```

## Cómo editar

- **Cambiar un color o el espaciado de todo el sitio** → `css/tokens.css`
- **Cambiar cómo se ve una sección** → `css/sections/<sección>.css`
- **Cambiar el texto o añadir tarjetas** → el `.html` de esa página
- **Cambiar el menú o el pie de página** → `js/layout.js` (se aplica a todas las páginas)
- **Añadir o quitar un patrocinador** → la lista `SPONSORS` en `js/layout.js`; los logos van en `fotos/sponsors/`
- **Editar miembros, divisiones o líderes** → `js/team-data.js`
- **Poner fotos de verdad** → `fotos/README.md` explica cómo cambiar un dibujo por una foto
- **Añadir un tab nuevo** → copia una página parecida (p. ej. `donar.html`), cambia su
  `<title>` y su contenido dentro de `<main>`, y añádela a la lista `PAGES` de `js/layout.js`
- **Que la página deje de verse bien en móvil** → `css/responsive.css`

Todas las páginas cargan los mismos `<link>`. Dos reglas al tocar su orden:

1. `tokens.css` va primero — el resto usa sus variables.
2. `responsive.css` va último — tiene que poder pisar lo anterior.

## Anuncios de eventos

Los anuncios se editan en `js/events-config.js`. Cada objeto necesita un `id`
único, `version`, uno de los tipos soportados (`raffle`, `competition`,
`activity`, `announcement` o `fundraising`), contenido en inglés, `active` y
`priority`. Un número de prioridad menor aparece primero.

- Sube imágenes a `fotos/` y coloca su ruta en `image`. Si se deja vacío o la
  imagen falla, aparece el arte de Solar Boat.
- Usa `displayStart` y `displayEnd` con `YYYY-MM-DD` o fecha/hora ISO. Las fechas
  sin zona horaria usan `America/Puerto_Rico`; `timeZone` permite cambiarla.
- Cambia `buttonText` y `buttonUrl` para el CTA. Sin URL válida, el botón queda
  deshabilitado y no navega.
- Incrementa `version` cuando un cambio de contenido deba tratarse como un
  anuncio nuevo. El cooldown de cuatro horas se guarda por `id` y `version`.
- Usa `active: false` para desactivar un evento sin borrarlo.

El popup muestra como máximo un evento por carga. Si el de mayor prioridad está
en cooldown, intenta el siguiente evento elegible. La página de Eventos permite
abrir manualmente el anuncio destacado sin modificar el cooldown automático.

## Equipo y divisiones

Toda la información del equipo se mantiene en `js/team-data.js`. La colección
`SOLAR_BOAT_TEAM_MEMBERS` alimenta automáticamente los conteos de las tarjetas,
las páginas de cada división y Leadership Spotlight; no dupliques un miembro en
varias páginas HTML.

- Para añadir una persona, agrega un objeto con un `id` único, `name`, una clave
  de `division` válida, `role` e `image`. `major` y `academicYear` son opcionales.
- Las claves de división disponibles están definidas en
  `SOLAR_BOAT_DIVISIONS`: `icom-inso`, `operations-logistics`, `inme` e `inel`.
- Usa `isLeader: true` para mostrar una persona en Leadership Spotlight y
  `leadershipOrder` para controlar su posición. Un número menor aparece antes.
- Guarda fotografías en `fotos/` y escribe la ruta relativa en `image`. Si falta
  o falla la imagen, se muestra el emblema existente como alternativa.
- Las personas cuya división todavía no se conozca pueden conservar
  `division: "unassigned"`; permanecen en los datos sin aparecer en una división
  incorrecta.

El menú Team de `js/layout.js` enlaza a `team.html` y a las cuatro páginas de
división. Los nombres, descripciones y destinos de las divisiones se editan una
sola vez en `SOLAR_BOAT_DIVISIONS`.

Los `<script>` son clásicos, no módulos, a propósito: así la página funciona
abriéndola con doble clic (los módulos ES fallan con `file://`) y las funciones
que llaman los `onclick` del HTML siguen siendo accesibles. `api.js` va primero
porque los demás usan su `postForm`.

## Ver el sitio

```bash
# Doble clic en index.html funciona, pero los formularios necesitan el backend:
cd web/backend && python app.py    # arranca en http://localhost:5000
python3 -m http.server 8000        # desde web/frontend/, abre http://localhost:8000
```

## Antes de publicar

`API_BASE` en `js/api.js` apunta a `http://localhost:5000`. Hay que cambiarlo al
URL de Render o los formularios fallarán en producción.
