# Pendientes — Sitio web Solar Boat UPRM

> Revisado: 2026-11-12
> Nombre oficial del equipo: **UPRM Solar Boat Team**
>
> Las tareas de diseño y contenido de este documento vienen de una revisión
> anterior. Confirma su vigencia con el equipo antes de tratarlas como pendientes.

---

## ✅ Hecho

- [x] **Fotos → mover al final de los tabs** — sección movida después de "Únete"; link reordenado en nav de escritorio, menú móvil y footer.
- [x] **Logros → historial** — la sección conserva el nombre "Logros" y ahora contiene:
  - Bloque **"Nuestros objetivos"** (4 tarjetas)
  - Línea de tiempo **"Año por año"** (2024→2021) con logro, recuadro *"El reto de ese año"* y espacio de foto por entrada
- [x] **Contacto → links a redes** — Instagram y Facebook añadidos bajo el formulario. LinkedIn queda comentado listo para activar.
- [x] **Título del hero** — "Ingeniería solar. / Campeones mundiales." → "UPRM Solar Boat Team. / Representando a P.R. internacionalmente."
- [x] **Equipo fuera de los tabs** — link quitado del nav de escritorio, menú móvil y footer. La sección sigue en la página (se llega bajando), pero ya no aparece en la navegación.
- [x] **Fuera "campeones mundiales" como lema** — cambiado por "Representando a P.R." en el `<title>`, la meta description, el encabezado de Sobre nosotros, el de Reclutamiento, el texto de Donar y la descripción del Solar Splash 2025.
- [x] **Sitio dividido en archivos** — `index.html` pasó de 2,700 líneas a `web/frontend/` con 20 archivos CSS, 5 de JS y un `index.html` de 1,088 líneas (solo contenido).

---

## 🔴 Bloqueado — necesito material del equipo

- [ ] **Añadir logo** — no hay ningún archivo de imagen en el proyecto. Hace falta el archivo para ponerlo en:
  - nav (`index.html`, `.nav-logo-img` — hoy es un SVG genérico de bote)
  - hero (`.hero-visual` — hoy es un SVG dibujado a mano)
  - footer
- [ ] **Unirse → link al formulario** — falta el URL. Hoy hay un campo de correo que va al backend (`/api/recruit`); se cambiaría por un link directo.
- [ ] **Equipo → nombres reales** — las 6 tarjetas dicen "Nombre Apellido" con roles genéricos (Team Captain, Mechanical Lead, Electrical Lead, Software Lead, Hull Design, Solar Systems).
- [ ] **Historial → rellenar los retos** — cada año tiene un placeholder `‹ Escribe aquí qué se complicó en 20XX… ›` que hay que sustituir por el reto real.
- [ ] **Historial → fotos por año** — cada entrada tiene un `<img>` comentado esperando `fotos/historial-2021.jpg` … `historial-2024.jpg`.

---

## ❓ Falta decidir

- [ ] **"Tab de arriba"** — no quedó claro qué cambio quería el equipo en el nav.
- [ ] **"Solar Splash"** — ¿un tab o sección nueva explicando qué es la competencia?
- [ ] **"Sobre nosotros → info corta de nosotros"** con logos, fotos y tareas pendientes — no quedó claro qué debe quedar en la sección. ¿Bloque corto de "quiénes somos" + fotos + logos de patrocinadores?
- [ ] **Noticias → "conectar a un tab"** — se decidió mantener una sola página, así que el link "Ver todas las noticias →" apunta a `#` y no lleva a ningún lado. Opciones: quitarlo, o crear `noticias.html` solo para el archivo completo.
- [ ] **Segunda línea del hero** — la nota original decía "Cambios innovadores → reconocidos a P.R. internacionalmente", pero en el sitio esa línea dice "Campeones mundiales." Se dejó como estaba. ¿Se cambia?
- [ ] **Marca del nav y `<title>`** — dicen "SolarBoat UPRM" y "Solar Boat UPRM — Campeones Mundiales", que no coinciden con el nombre oficial "UPRM Solar Boat Team". ¿Se unifican?
- [ ] **¿Se borra la sección de Equipo entera?** — se quitó de los tabs, pero la sección sigue visible al bajar y todavía muestra "Nombre Apellido" seis veces. O se rellena con nombres reales, o se borra del todo.
- [ ] **"Conocer el equipo → posteriormente eliminar"** — dejado pendiente a propósito. Se refiere al botón del hero "Conoce el equipo".
- [ ] **Preguntar al equipo sobre conocimiento** — tarea del equipo, no del sitio.

---

## ⏸️ Diferido a propósito

- [ ] **Eventos** — se dejó tal cual por ahora. Pendiente decidir entre (a) mantenerlo y añadir soporte de imagen a cada tarjeta, o (b) eliminarlo y mover los avisos a Instagram/Noticias.
- [ ] **Fotos reales** — todas las fotos del sitio son dibujos de relleno. Faltan las cuatro del inicio (`index.html`, sección Fotos clave) y las seis de `fotos.html`; van en `web/frontend/fotos/` (ver su README).
  El diseño de "El equipo en acción" (una grande + tres pequeñas) queda pendiente de decidir: se acomoda cuando se tengan las fotos reales y se vea qué forma traen.
- [ ] **Donar** — la implementación se trabaja más tarde. PayPal y Venmo se quitaron del sitio (2026-09-15); quedan ATH Móvil (falta el número real) y Patrocinio empresarial.
- [ ] **Equipo → actualizar seguido** — mantenimiento continuo, no un cambio puntual.

---

## 🔧 Notas técnicas

- `API_BASE` está en `web/frontend/js/api.js` y apunta a `http://localhost:5000`.
  El formulario de contacto usa `mailto:` y la página Únete enlaza a Linktree.
  Los endpoints de reclutamiento y avisos siguen en el backend, pero los
  manejadores correspondientes de `web/frontend/js/forms.js` no están conectados
  a formularios de las páginas actuales. El enlace de calendario sí usa `API_BASE`.
- `.github/workflows/deploy-pages.yml` publica `web/frontend/` al hacer push a
  `main`; GitHub Pages debe estar configurado para usar GitHub Actions.
- `web/backend/render.yaml` contiene la configuración de Render. El estado real
  de los despliegues de GitHub Pages y Render debe confirmarse en sus paneles.
- El repositorio tiene configurado el remoto `origin`. La rama de revisión no
  publica ni despliega cambios automáticamente.
