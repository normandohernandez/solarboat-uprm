# Sitio web — UPRM Solar Boat Team

Sitio estático. No hay build ni dependencias: se abre `index.html` y ya.

## Estructura

```
web/frontend/
  index.html          Todo el contenido de la página
  css/
    tokens.css        Colores, tipografía y espaciado. Empieza aquí para recolorear el sitio.
    base.css          Reset y estilos base
    utilities.css     Piezas compartidas: .container, .btn, .tag, .section-heading
    nav.css           Barra de navegación y menú móvil
    footer.css        Pie de página
    animations.css    Aparición al hacer scroll (.reveal)
    sections/         Un archivo por sección de la página
    responsive.css    Todos los @media juntos
  js/
    api.js            Contacto con el backend. Aquí está API_BASE.
    nav.js            Menú móvil
    reveal.js         Animación de scroll
    gallery.js        Filtros y visor de fotos
    forms.js          Los cuatro formularios
```

## Cómo editar

- **Cambiar un color o el espaciado de todo el sitio** → `css/tokens.css`
- **Cambiar cómo se ve una sección** → `css/sections/<sección>.css`
- **Cambiar el texto o añadir tarjetas** → `index.html`
- **Que la página deje de verse bien en móvil** → `css/responsive.css`

Dos reglas al tocar el orden de los `<link>` en `index.html`:

1. `tokens.css` va primero — el resto usa sus variables.
2. `responsive.css` va último — tiene que poder pisar lo anterior.

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
