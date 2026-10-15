# Logos de patrocinadores

Pon aquí el logo de cada patrocinador (`.png` con fondo transparente o `.svg`).
El pie de página los muestra a 34 px de alto, así que con 300–600 px de ancho basta.

Después añádelo a la lista `SPONSORS` en `js/layout.js`:

```js
{ name: 'Nombre de la empresa', url: 'https://empresa.com', logo: 'fotos/sponsors/empresa.png' },
```

Si un patrocinador no tiene logo, deja `logo: ''` y se mostrará su nombre escrito.
