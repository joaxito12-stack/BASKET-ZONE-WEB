# Basket Zone

Web de baloncesto en HTML, CSS y JavaScript puro (sin instalación): BZ Academy (lecciones, fichas didácticas con diagramas y vídeos, y progreso), reto de preguntas, historia, glosario y guía de competiciones.

## Archivos
| Archivo o carpeta | Para qué sirve |
|---|---|
| `index.html` | Estructura y textos de todas las páginas |
| `styles.css` | Diseño y colores (variables al inicio) |
| `script.js` | Funcionamiento: navegación, lecciones, fichas de la Academia, reto, formulario |
| `data.js` | Datos: lecciones, preguntas y datos de demostración |
| `avatar.js` y `avatar.css` | Editor de avatar (busto 2D) y su diseño |
| `assets/` | Imágenes e íconos |
| `GUIA-EDICION.md` | Guía para modificar la web y prepararse para la evaluación |

Mantén los archivos en la misma carpeta y con estos nombres exactos, en minúsculas.

## Cómo editar
- Textos de una página: su `<section>` en `index.html`.
- Nueva lección: copia un bloque de `LECCIONES` con un `id` nuevo.
- Nueva pregunta: copia un bloque de `PREGUNTAS`.
- Colores: bloque `:root` en `styles.css`.
- Textos y vídeos de las fichas de la Academia: objeto `CONTENIDO_TEMAS` en `script.js`. Imágenes de los temas: `assets/img/`.
- Tras publicar cambios, sube el número de `?v=6` en `index.html` si el navegador sigue mostrando la versión vieja.

## Ver en tu ordenador
Abre la carpeta en Visual Studio Code y usa la extensión Live Server (ver `GUIA-EDICION.md`), o abre `index.html` con doble clic.

## Animaciones
Pantalla de carga, portada animada, aparición al hacer scroll, contadores, temporizador del reto y microinteracciones. Se desactivan con "reducir movimiento". Detalles en `GUIA-EDICION.md`.

## Limitaciones
- No hay datos deportivos en vivo: haría falta una API.
- No hay cuentas, amigos ni clasificación global: haría falta un servidor y una base de datos.
- El progreso se guarda solo en el navegador del usuario.
