#  BASKET ZONE
### Tu mundo, tu cancha

**Basket Zone** es una página web educativa e interactiva dedicada al baloncesto. Su objetivo es reunir en un solo lugar información para aprender sobre este deporte, conocer sus competiciones y jugadores, practicar los conocimientos adquiridos y personalizar la experiencia mediante un perfil.

El proyecto está desarrollado con **HTML, CSS y JavaScript**, sin necesidad de instalar dependencias ni utilizar un servidor propio.

##  ¿Qué puedes encontrar en Basket Zone?

- **Inicio:** presentación del sitio, accesos a sus secciones y algunos datos comparativos entre las reglas FIBA y NBA.
- **Partidos:** marcadores y encuentros de demostración para mostrar cómo se puede presentar la información de los partidos.
- **Jugadores:** información y comparación de jugadores mediante la sección correspondiente.
- **Aprende:** contenidos educativos sobre fundamentos, posiciones, técnicas y estrategias del baloncesto, acompañados de recursos visuales.
- **Retos:** preguntas interactivas con categorías y niveles de dificultad, puntuación, explicaciones y resultados.
- **Historia:** contenido para conocer el origen y la evolución del baloncesto.
- **Comunidad:** espacio de participación incluido en la página.
- **Mi perfil:** personalización del nombre y avatar, además del seguimiento del progreso, puntuaciones e insignias.

##  Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura y contenido de la página |
| CSS3 | Diseño, distribución, colores, animaciones y adaptación a pantallas |
| JavaScript | Navegación, interacciones, retos, perfil y almacenamiento del progreso |
| SVG | Logotipos, íconos e ilustraciones vectoriales |

El proyecto también utiliza las fuentes **Big Shoulders Display** y **DM Sans** desde Google Fonts.

##  Estructura del proyecto

```text
basket-zone-fusion/
├── index.html
├── styles.css
├── script.js
├── data.js
├── avatar.css
├── avatar.js
├── GUIA-EDICION.md
├── assets/
│   ├── icons/
│   │   └── favicon.svg
│   └── img/
│       ├── logo.svg
│       ├── pelota.svg
│       ├── cancha.svg
│       └── imágenes de fundamentos y estrategias
└── .gitignore
```

## Cómo ejecutar el proyecto

No es necesario instalar programas ni paquetes adicionales.

1. Descarga o clona este repositorio.
2. Abre la carpeta `basket-zone-fusion`.
3. Abre el archivo `index.html` en un navegador web.

También puedes abrir la carpeta en **Visual Studio Code** y utilizar la extensión **Live Server** para visualizar los cambios mientras editas el proyecto.

## Guardado de información

El progreso, las puntuaciones y algunos datos del perfil se guardan en el almacenamiento local del navegador (`localStorage`). Por eso, la información se mantiene en el mismo navegador y dispositivo, pero no se sincroniza automáticamente con otros dispositivos ni crea cuentas en línea.

## Consideraciones

- Los partidos y marcadores identificados como demostración son ficticios y no representan resultados deportivos reales.
- La página no consulta resultados en vivo ni utiliza una API deportiva.
- Las funciones de perfil y progreso trabajan localmente en el navegador; no existe una base de datos ni un sistema de usuarios en un servidor.
- Para cargar correctamente las fuentes de Google Fonts se necesita conexión a internet. El resto del sitio está construido con archivos locales.

## Personalización y edición

Puedes utilizar `GUIA-EDICION.md` como referencia para modificar el proyecto.

- **Contenido y secciones:** `index.html`.
- **Diseño y estilos:** `styles.css` y `avatar.css`.
- **Interacciones y funcionamiento:** `script.js` y `avatar.js`.
- **Preguntas y datos de las lecciones:** `data.js`.
- **Imágenes e íconos:** carpeta `assets/`.

Al editar, conserva las rutas y los nombres de los archivos para evitar que se rompan los enlaces entre ellos.

---

**BASKET ZONE — Tu mundo, tu cancha.** 
