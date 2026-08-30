# UPRM Solar Boat Team

Sitio web y backend del equipo de botes solares de la Universidad de Puerto Rico,
Recinto de Mayagüez.

## Estructura

```
web/
  frontend/   Sitio estático — HTML, CSS y JS. Sin build ni dependencias.
  backend/    API en Flask + SQLite para los formularios del sitio.
PENDIENTES.md Lo que falta por hacer, por estado.
```

Cada carpeta tiene su propio README con el detalle.

## Arrancarlo local

```bash
# API (formularios y calendario)
cd web/backend
pip install -r requirements.txt
python app.py                      # http://localhost:5000

# Sitio
cd web/frontend
python3 -m http.server 8000        # http://localhost:8000
```

El sitio abre con doble clic en `index.html`, pero los formularios necesitan
el backend corriendo.

## Estado

En desarrollo, todavía sin desplegar. Antes de publicar hay que resolver lo
que está marcado como bloqueador en [PENDIENTES.md](PENDIENTES.md) — sobre todo
`API_BASE` en `web/frontend/js/api.js`, que apunta a `localhost`.
