# Guía de edición de Basket Zone

## 1. Abrir y ver cambios en tiempo real (Visual Studio Code)
1. Abre VS Code, **Archivo → Abrir carpeta** y elige la carpeta del proyecto.
2. Instala la extensión **Live Server** (VS Code te la recomienda al abrir la carpeta).
3. Clic derecho sobre `index.html` → **Open with Live Server**. Se abre el navegador y se actualiza solo cada vez que guardas (Ctrl+S).

Sin extensión: abre `index.html` con doble clic y recarga con F5.

## 2. Qué hace cada archivo
| Archivo | Lenguaje | Función |
|---|---|---|
| `index.html` | HTML | **Estructura y textos**: menú, cada página (`<section>`), pie de página |
| `styles.css` | CSS | **Diseño**: colores, tipografías, tamaños, distribución, móvil |
| `script.js` | JavaScript | **Funcionamiento**: navegación, lecciones, reto, formulario, tablas y avatares pequeños |
| `avatar.js` | JavaScript | **Editor de avatar** (busto 2D): opciones, dibujo, guardado y descarga |
| `avatar.css` | CSS | **Diseño del editor de avatar** y de los avatares pequeños |
| `data.js` | JavaScript | **Datos**: lecciones, preguntas y datos de demostración |
| `assets/img/`, `assets/icons/` | Imágenes | Logo, ilustración de portada e ícono de la pestaña |

## 3. Dónde cambiar cada cosa
| Quiero… | Archivo y lugar |
|---|---|
| Cambiar un título o texto | `index.html`: busca el texto (Ctrl+F) y edítalo |
| Cambiar los colores principales | `styles.css`, bloque `:root` al inicio (`--naranja`, `--fondo`, `--panel`…) |
| Cambiar el tamaño de la imagen de portada | `styles.css`, `.imagen-portada` → `max-width: 420px;` |
| Cambiar la imagen | Reemplaza `assets/img/cancha.svg` o cambia el `src` de la imagen en `index.html` |
| Cambiar la distribución de la portada | `styles.css`, `.portada-grid` → `grid-template-columns` |
| Añadir o quitar un elemento de una sección | `index.html`: copia o borra una `<div class="caja">…</div>` dentro de su `<section>` |
| Añadir una página nueva | `index.html`: copia una `<section class="pagina" id="...">` con un id nuevo y agrega `<a href="#id">` al menú |
| Cambiar el contenido del cuestionario | `data.js`, lista `PREGUNTAS` (copia un bloque `{ ... }`) |
| Cambiar los puntos por acierto | `data.js`: `PUNTOS_ACIERTO` y `PUNTOS_EXTRA` |
| Añadir una lección | `data.js`, lista `LECCIONES` (usa un `id` nuevo) |
| Modificar el comportamiento de un botón | `script.js`: busca su función (por ejemplo `compartirResultado` para «Compartir resultado», `borrarDatos` para «Borrar mis datos») |
| Cambiar las reglas del formulario del nombre | `script.js`, función `guardarNombre` (largo mínimo y máximo, caracteres permitidos) |
| Ajustar el diseño en celular | `styles.css`, al final de cada bloque hay `@media (max-width: 800px)` y `480px` |
| Cambiar los datos de demostración | `data.js`, apartado 5 |
| Cambiar el texto o los vídeos de una ficha de la Academia | `script.js`, objeto `CONTENIDO_TEMAS` (los vídeos en inglés están en `CONSULTAS_VIDEO_EN`) |
| Cambiar la imagen de un tema de la Academia | Guarda el archivo en `assets/img/` y actualiza su ruta en `imagenesTema`, dentro de `graficoTema` (`script.js`) |
| Añadir o quitar colores o peinados del avatar | `avatar.js`, objeto `CATALOGS` (al inicio): cada opción es `["valor", "Nombre"]` |
| Cambiar el color con el que arranca el avatar | `avatar.js`, objeto `DEFAULTS` |
| Cambiar dónde se ve el avatar pequeño | `script.js`, funciones `avatarMini` y `actualizarAvatares`; en `index.html`, los elementos `perfil-avatar-mini` y `comunidad-avatar` |
| Cambiar el aspecto del avatar pequeño | `avatar.css`, bloque `.avatar-mini` |
| Cambiar los segundos de cada pregunta del reto | `data.js`: `TIEMPO_PREGUNTA` |
| Hacer una animación más lenta o rápida | `styles.css`, sección 15: cambia los segundos (por ejemplo `.9s`) |
| Quitar una animación | `styles.css`, sección 15: borra la línea `animation:` de esa regla |
| Cambiar qué elementos aparecen al hacer scroll | `script.js`, `SELECTOR_REVELAR` (sección 8) |
| Cambiar la imagen o la pelota de la portada | `assets/img/cancha.svg` y `assets/img/pelota.svg` |
| Animar un número | En `index.html`: `<span class="contador" data-valor="25">25</span>` |

## 3.1 Cómo están organizadas las animaciones
- **Qué se mueve y cómo:** `styles.css`, sección 15 (cargador, portada, aparición al hacer scroll, botones, partidos, jugadores, retos).
- **Qué las activa:** `script.js`, sección 8 (cargador, observador de scroll, contadores y parallax).
- **Accesibilidad:** si el dispositivo tiene activado "reducir movimiento", las animaciones se desactivan solas (final de la sección 15).

## 3.2 El avatar
- El avatar se guarda en el navegador (`localStorage`, clave `basketZoneAvatar`), solo se ve en tu dispositivo.
- Aparece en **Mi perfil**, en el **resultado del reto** y en **Comunidad** (el círculo «TÚ»).
- Cambiar una opción no guarda: hay que pulsar «Guardar avatar». Si no hay avatar guardado, esos lugares muestran un aviso o «TÚ».
- El color del accesorio solo aparece si eliges vincha o gorra.

## 4. Pruebas rápidas que puedes hacer
1. En `index.html`, cambia «Tu mundo, tu cancha» por otro eslogan, guarda y mira el navegador.
2. En `styles.css`, cambia `--naranja: #F47721;` por `#2E86FF;` y observa cómo cambia todo el color principal.
3. En `data.js`, cambia `PUNTOS_ACIERTO = 10` por `20` y haz el reto.
4. En `styles.css`, cambia `max-width: 420px` de `.imagen-portada` por `250px`.
5. En `styles.css`, cambia `animation: flotar 4s` de `.pelota-flotante` por `animation: flotar 1s` y mira la pelota.
6. En `index.html`, copia una caja de la portada de Inicio y observa la nueva caja.

## 5. Publicar en GitHub Pages
Los pasos están en `README.md`. Tras cada cambio importante, sube los archivos a GitHub (o edítalos allí con el lápiz), espera 1 o 2 minutos y prueba el enlace público. Si ves la versión antigua, sube el número de `?v=6` en `index.html`.

## 6. Lista de revisión antes de entregar
- [ ] La web funciona al abrirla con Live Server.
- [ ] Reconozco los archivos HTML, CSS y JavaScript.
- [ ] Probé al menos una modificación de texto, de color y de funcionamiento.
- [ ] Los cambios se ven en el navegador.
- [ ] La versión de GitHub Pages abre desde otro dispositivo.
- [ ] Los nombres de archivos están en minúsculas: GitHub distingue mayúsculas.
