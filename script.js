/* ==========================================================
   FUNCIONAMIENTO DE LA WEB (JavaScript)
   1. Guardado   2. Páginas y menú   3. Lecciones   4. Reto
   5. Perfil y formulario   6. Partidos   7. Jugadores   8. Animaciones   8.5 Fichas de BZ Academy   9. Arranque
   Necesita que data.js se cargue antes (index.html ya lo hace).
   ========================================================== */

/* ---------- 1. GUARDAR Y LEER EN EL NAVEGADOR ---------- */
function guardar(clave, valor) {
  try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) {}
}
function leer(clave, porDefecto) {
  try { var d = localStorage.getItem(clave); return d ? JSON.parse(d) : porDefecto; }
  catch (e) { return porDefecto; }
}

/* ---------- 2. PÁGINAS Y MENÚ ---------- */
function mostrarPagina() {
  detenerTemporizador();
  var id = (location.hash || "#inicio").slice(1);
  var pagina = document.getElementById(id);
  // Si la dirección no corresponde a una página, se muestra la de error
  if (!pagina || !pagina.classList.contains("pagina")) { id = "error404"; pagina = document.getElementById(id); }

  // Muestra solo la página actual (la clase "activa" la hace visible en styles.css)
  document.querySelectorAll(".pagina").forEach(function (p) { p.classList.remove("activa"); });
  pagina.classList.add("activa");

  // Marca el enlace actual del menú y pone el título de la pestaña
  var nombre = "";
  document.querySelectorAll("#nav a").forEach(function (a) {
    if (a.getAttribute("href") === "#" + id) { a.setAttribute("aria-current", "page"); nombre = a.textContent; }
    else a.removeAttribute("aria-current");
  });
  document.getElementById("nav").classList.remove("open");
  document.title = (nombre ? nombre + " · " : "") + "Basket Zone";

  // Cada página prepara su contenido dinámico
  if (id === "aprende") prepararLecciones();
  if (id === "retos") pantallaInicioReto();
  if (id === "perfil") prepararPerfil();
  if (id === "partidos") prepararPartidos();
  if (id === "jugadores") prepararJugadores();
  actualizarAvatares();   // avatar guardado en Comunidad y Perfil

  animarAlDesplazar(pagina);   // apariciones y contadores (sección 8)
  actualizarParallax();
}
window.addEventListener("hashchange", function () { mostrarPagina(); window.scrollTo(0, 0); });

// botón "Menú" del móvil
document.getElementById("mb").addEventListener("click", function () {
  var abierto = document.getElementById("nav").classList.toggle("open");
  this.setAttribute("aria-expanded", abierto);
});

/* ---------- 3. LECCIONES ---------- */
function prepararLecciones() {
  var hechas = leer("lecciones", []);
  document.getElementById("lista-lecciones").innerHTML = LECCIONES.map(function (l) {
    return "<details><summary>" + l.titulo + ' <span class="nivel">' + l.nivel + "</span></summary>" +
      "<p>" + l.texto + "</p><p><strong>Consejo:</strong> " + l.consejo + "</p>" +
      (l.errores ? "<p><strong>Error común:</strong> " + l.errores + "</p>" : "") +
      '<label><input type="checkbox" data-id="' + l.id + '"' + (hechas.indexOf(l.id) >= 0 ? " checked" : "") +
      "> Marcar como completada</label></details>";
  }).join("");

  document.querySelectorAll("input[data-id]").forEach(function (c) {
    c.addEventListener("change", function () {
      var lista = leer("lecciones", []).filter(function (x) { return x !== c.dataset.id; });
      if (c.checked) lista.push(c.dataset.id);
      guardar("lecciones", lista);
      mostrarProgreso();
    });
  });
  mostrarProgreso(true);
}
function mostrarProgreso(desdeCero) {
  var n = leer("lecciones", []).length;
  var barra = document.getElementById("progreso-barra");
  document.getElementById("progreso-texto").textContent = n + " de " + LECCIONES.length + " lecciones";
  if (desdeCero) { barra.style.width = "0"; void barra.offsetWidth; }   // la barra crece desde cero
  barra.style.width = Math.round(n / LECCIONES.length * 100) + "%";
}

/* ---------- 4. RETOS ----------
   Modos, categorías, preguntas, puntos, niveles e insignias se editan en data.js. */
var temporizador = null;   // reloj de la pregunta actual
var reto = null;           // reto en curso: modo, preguntas, indice, puntos, aciertos, vidas, falladas

function detenerTemporizador() { clearInterval(temporizador); temporizador = null; }

// Cuenta atrás de cada pregunta: si llega a 0 se cuenta como fallo
function iniciarTemporizador(segundos) {
  detenerTemporizador();
  var fin = Date.now() + segundos * 1000;
  var barra = document.getElementById("barra-tiempo");
  var texto = document.getElementById("texto-tiempo");
  temporizador = setInterval(function () {
    var resto = fin - Date.now();
    if (resto <= 0) { responder(-1); return; }
    barra.style.width = (resto / (segundos * 10)) + "%";
    texto.textContent = Math.ceil(resto / 1000) + " s";
    barra.parentNode.classList.toggle("urgente", resto <= 5000);
  }, 100);
}

/* --- 4.1 Herramientas --- */
// Devuelve una copia de la lista en orden aleatorio
function mezclar(lista) {
  var copia = lista.slice();
  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)), t = copia[i];
    copia[i] = copia[j]; copia[j] = t;
  }
  return copia;
}

// Copia de la pregunta con las respuestas en otro orden (verdadero/falso no se mezcla)
function prepararPregunta(p) {
  var orden = p.opciones.map(function (x, i) { return i; });
  if (p.opciones.length > 2) orden = mezclar(orden);
  return { pregunta: p.pregunta, categoria: p.categoria, dificultad: p.dificultad, explicacion: p.explicacion,
    opciones: orden.map(function (i) { return p.opciones[i]; }), correcta: orden.indexOf(p.correcta) };
}

function nombreCategoria(id) {
  var c = CATEGORIAS.filter(function (x) { return x.id === id; })[0];
  return c ? c.nombre : id;
}

/* --- 4.2 Estadísticas, niveles e insignias (se guardan en este navegador) --- */
function leerEstadisticas() {
  var e = leer("estadisticas", null) || {};
  return { retos: e.retos || 0, perfectos: e.perfectos || 0, puntosTotales: e.puntosTotales || 0, historial: e.historial || [] };
}

// Números con los que se comparan los requisitos de las insignias (ver INSIGNIAS en data.js)
function valoresInsignias() {
  var e = leerEstadisticas();
  return { retos: e.retos, perfectos: e.perfectos, puntosTotales: e.puntosTotales, mejor: leer("mejor", 0), lecciones: leer("lecciones", []).length };
}

function insigniasObtenidas() {
  var v = valoresInsignias();
  return INSIGNIAS.filter(function (i) { return v[i.requisito] >= i.valor; }).map(function (i) { return i.id; });
}

function nivelActual(puntos) {
  var nivel = NIVELES[0];
  NIVELES.forEach(function (n) { if (puntos >= n.puntos) nivel = n; });
  return nivel;
}

// Dibuja todas las insignias (las no conseguidas aparecen apagadas)
function dibujarInsignias(idContenedor) {
  var contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;
  var obtenidas = insigniasObtenidas();
  contenedor.innerHTML = '<div class="insignias">' + INSIGNIAS.map(function (i) {
    var ok = obtenidas.indexOf(i.id) >= 0;
    return '<div class="insignia ' + (ok ? "obtenida" : "bloqueada") + '"><span class="hex" aria-hidden="true">' + i.simbolo + "</span><div><strong>" +
      i.nombre + "</strong><small>" + i.descripcion + "<br>" + (ok ? "Conseguida" : "Bloqueada") + "</small></div></div>";
  }).join("") + "</div>";
}

// Mis 5 mejores resultados (de los últimos 20 guardados)
function dibujarMejores(idContenedor) {
  var contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;
  var lista = leerEstadisticas().historial.slice().sort(function (a, b) { return b.puntos - a.puntos; }).slice(0, 5);
  contenedor.innerHTML = lista.length ? tablaResultados(lista) : '<p class="gris">Todavía no has completado ningún reto.</p>';
}

function tablaResultados(lista) {
  return '<div class="tabla-scroll"><table><thead><tr><th>#</th><th>Modo</th><th>Categoría</th><th>Puntos</th><th>Aciertos</th></tr></thead><tbody>' +
    lista.map(function (r, i) {
      return "<tr><td>" + (i + 1) + "</td><th scope='row'>" + escaparHTML(r.modo) + "</th><td>" + escaparHTML(r.categoria) + "</td><td>" + r.puntos + "</td><td>" + r.aciertos + "/" + r.total + "</td></tr>";
    }).join("") + "</tbody></table></div>";
}

// Zona de insignias y mejores resultados que aparece debajo del reto
function actualizarExtrasReto(visible) {
  var extra = document.getElementById("retos-extra");
  if (!extra) return;
  extra.hidden = !visible;
  if (visible) { dibujarInsignias("retos-insignias"); dibujarMejores("retos-mejores"); }
}

/* --- 4.3 Pantalla de inicio: elegir modo, categoría y dificultad --- */
function preguntasDisponibles() {
  var cat = document.getElementById("sel-categoria").value, dif = document.getElementById("sel-dificultad").value;
  return PREGUNTAS.filter(function (p) {
    return (cat === "todas" || p.categoria === cat) && (dif === "todas" || p.dificultad === dif);
  });
}

function pantallaInicioReto() {
  detenerTemporizador();
  reto = null;
  var modos = MODOS.map(function (m, i) {
    return '<label class="opcion-modo"><input type="radio" name="modo" value="' + m.id + '"' + (i === 0 ? " checked" : "") + '><span><strong>' +
      m.nombre + "</strong><small>" + m.descripcion + "</small></span></label>";
  }).join("");
  var categorias = '<option value="todas">Todas las categorías</option>' + CATEGORIAS.map(function (c) {
    return '<option value="' + c.id + '">' + c.nombre + "</option>";
  }).join("");
  document.getElementById("quiz").innerHTML =
    '<div class="entrada"><h2>Elige tu reto</h2><fieldset class="modos"><legend>Modo de juego</legend>' + modos + "</fieldset>" +
    '<div class="filtros"><div><label for="sel-categoria">Categoría</label><select id="sel-categoria">' + categorias + "</select></div>" +
    '<div><label for="sel-dificultad">Dificultad</label><select id="sel-dificultad"><option value="todas">Todas</option><option value="facil">Fácil (' +
    PUNTOS_POR_DIFICULTAD.facil + ' pts)</option><option value="medio">Media (' + PUNTOS_POR_DIFICULTAD.medio + ' pts)</option><option value="dificil">Difícil (' +
    PUNTOS_POR_DIFICULTAD.dificil + ' pts)</option></select></div></div>' +
    '<p class="gris" id="info-reto"></p><p class="gris">Las preguntas y las respuestas salen en orden aleatorio. Tu puntuación se guarda solo en este navegador.</p>' +
    '<button class="boton" id="empezar">Empezar reto</button></div>';
  function actualizarInfo() {
    var n = preguntasDisponibles().length;
    document.getElementById("info-reto").textContent = n ? "Preguntas disponibles con estos filtros: " + n + "." : "No hay preguntas con estos filtros. Cambia la categoría o la dificultad.";
    document.getElementById("empezar").disabled = n === 0;
  }
  document.getElementById("sel-categoria").addEventListener("change", actualizarInfo);
  document.getElementById("sel-dificultad").addEventListener("change", actualizarInfo);
  document.getElementById("empezar").addEventListener("click", iniciarReto);
  actualizarInfo();
  actualizarExtrasReto(true);
}

/* --- 4.4 Reto en curso --- */
function iniciarReto() {
  var idModo = document.querySelector('input[name="modo"]:checked').value;
  var modo = MODOS.filter(function (m) { return m.id === idModo; })[0];
  var cat = document.getElementById("sel-categoria").value;
  var preguntas = mezclar(preguntasDisponibles()).slice(0, modo.preguntas).map(prepararPregunta);
  reto = { modo: modo, categoria: cat === "todas" ? "Todas" : nombreCategoria(cat), preguntas: preguntas,
    indice: 0, puntos: 0, aciertos: 0, vidas: modo.vidas, falladas: [] };
  actualizarExtrasReto(false);
  mostrarPregunta();
}

function mostrarPregunta() {
  var p = reto.preguntas[reto.indice], modo = reto.modo;
  var avance = Math.round(reto.indice / reto.preguntas.length * 100);
  var html = '<div class="entrada"><p class="gris">' + modo.nombre + " · Pregunta " + (reto.indice + 1) + (modo.vidas ? "" : " de " + reto.preguntas.length) + " · " + reto.puntos + " puntos" +
    (modo.vidas ? " · Vidas: " + reto.vidas : "") + "</p>" +
    '<div class="barra-progreso"><div style="width:' + avance + '%"></div></div>' +
    (modo.tiempo ? '<div class="tiempo"><i id="barra-tiempo"></i></div><p class="gris" id="texto-tiempo">' + modo.tiempo + " s</p>" : "") +
    '<p><span class="nivel">' + nombreCategoria(p.categoria) + '</span><span class="nivel">' + p.dificultad + "</span></p><h2>" + p.pregunta + "</h2>";
  p.opciones.forEach(function (t, i) { html += '<button class="opcion" data-i="' + i + '">' + t + "</button>"; });
  var caja = document.getElementById("quiz");
  caja.innerHTML = html + "</div>";
  caja.querySelectorAll(".opcion").forEach(function (b) {
    b.addEventListener("click", function () { responder(Number(b.dataset.i)); });
  });
  if (modo.tiempo) iniciarTemporizador(modo.tiempo);
}

// elegida = -1 significa que se acabó el tiempo
function responder(elegida) {
  detenerTemporizador();
  var p = reto.preguntas[reto.indice], caja = document.getElementById("quiz");
  caja.querySelectorAll(".opcion").forEach(function (b, i) {
    b.disabled = true;
    if (i === p.correcta) b.classList.add("correcta");
    else if (i === elegida) b.classList.add("incorrecta");
  });
  if (elegida === p.correcta) {
    reto.aciertos++;
    reto.puntos += PUNTOS_POR_DIFICULTAD[p.dificultad];
  } else {
    reto.falladas.push(p);
    if (reto.modo.vidas) reto.vidas--;
  }
  var termina = reto.indice === reto.preguntas.length - 1 || (reto.modo.vidas && reto.vidas <= 0);
  caja.insertAdjacentHTML("beforeend", (elegida < 0 ? '<p class="nota">Se agotó el tiempo.</p>' : "") +
    "<p>" + p.explicacion + '</p><button class="boton" id="siguiente">' + (termina ? "Ver resultado" : "Siguiente") + "</button>");
  document.getElementById("siguiente").addEventListener("click", function () {
    reto.indice++;
    if (termina) mostrarResultado(); else mostrarPregunta();
  });
}

/* --- 4.5 Resultado --- */
function mostrarResultado() {
  var respondidas = reto.indice, hoy = new Date().toLocaleDateString("es-ES");
  var perfecto = respondidas >= 5 && reto.aciertos === respondidas;
  var antes = insigniasObtenidas(), stats = leerEstadisticas();
  var nivelAntes = nivelActual(stats.puntosTotales).nombre;

  // Guardar estadísticas
  stats.retos++;
  stats.puntosTotales += reto.puntos;
  if (perfecto) stats.perfectos++;
  stats.historial.unshift({ fecha: hoy, modo: reto.modo.nombre, categoria: reto.categoria, puntos: reto.puntos, aciertos: reto.aciertos, total: respondidas });
  stats.historial = stats.historial.slice(0, 20);
  guardar("estadisticas", stats);
  if (reto.puntos > leer("mejor", 0)) guardar("mejor", reto.puntos);

  // Novedades: insignias nuevas y subida de nivel
  var nuevas = INSIGNIAS.filter(function (i) { return insigniasObtenidas().indexOf(i.id) >= 0 && antes.indexOf(i.id) < 0; });
  var nivelNuevo = nivelActual(stats.puntosTotales).nombre;
  var novedades = "";
  if (nivelNuevo !== nivelAntes) novedades += '<p class="nota">¡Subiste de nivel! Ahora eres ' + nivelNuevo + ".</p>";
  nuevas.forEach(function (i) { novedades += '<p class="nota">¡Nueva insignia: ' + i.nombre + "!</p>"; });

  // Repaso de los fallos
  var repaso = reto.falladas.length ? "<details><summary>Repasa tus fallos (" + reto.falladas.length + ")</summary>" + reto.falladas.map(function (p) {
    return "<p><strong>" + p.pregunta + "</strong><br>Respuesta correcta: " + p.opciones[p.correcta] + ". " + p.explicacion + "</p>";
  }).join("") + "</details>" : "";

  document.getElementById("quiz").innerHTML =
    "<div class='entrada'>" + cabeceraJugador() + "<h2>Resultado</h2><p class='numero'><span class='contador' data-valor='" + reto.puntos + "' data-destello='1'>" + reto.puntos + "</span> puntos</p>" +
    "<p>" + reto.aciertos + " de " + respondidas + " respuestas correctas · " + reto.modo.nombre + " · " + reto.categoria + "</p>" +
    "<p class='gris'>Nivel: " + nivelNuevo + " (" + stats.puntosTotales + " puntos en total)</p>" + novedades + repaso +
    '<button class="boton" id="repetir">Jugar otra vez</button><button class="boton vacio" id="compartir">Compartir resultado</button><p class="gris" id="aviso-compartir"></p></div>';
  document.getElementById("repetir").addEventListener("click", pantallaInicioReto);
  document.getElementById("compartir").addEventListener("click", compartirResultado);
  activarContadores(document.getElementById("quiz"));
  actualizarExtrasReto(true);
}

// Comparte la puntuación (menú de compartir del móvil o copiar al portapapeles)
function compartirResultado() {
  var nombre = leer("nombre", "");
  var texto = (nombre ? nombre + " hizo " : "Hice ") + reto.puntos + " puntos en el reto " + reto.modo.nombre + " de Basket Zone. ¿Puedes superarlo? " + location.href.split("#")[0] + "#retos";
  var aviso = document.getElementById("aviso-compartir");
  if (navigator.share) {
    navigator.share({ text: texto }).catch(function () {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(texto).then(
      function () { aviso.textContent = "Texto copiado. Pégalo en un chat para retar a un amigo."; },
      function () { aviso.textContent = texto; });
  } else {
    aviso.textContent = texto;
  }
}

/* ---------- 5. PERFIL Y FORMULARIO ---------- */
// Refresca números, nombre y avatares pequeños del perfil (no toca el editor de avatar)
function mostrarDatosPerfil() {
  var nombre = leer("nombre", "");
  document.getElementById("perfil-lecciones").textContent = leer("lecciones", []).length;
  document.getElementById("perfil-total").textContent = " de " + LECCIONES.length;
  document.getElementById("perfil-puntos").textContent = leer("mejor", 0);
  var est = leerEstadisticas(), nivel = nivelActual(est.puntosTotales);
  document.getElementById("perfil-nivel").textContent = nivel.nombre;
  document.getElementById("perfil-retos").textContent = est.retos;
  document.getElementById("perfil-puntos-totales").textContent = est.puntosTotales;
  dibujarInsignias("perfil-insignias");
  var historial = document.getElementById("perfil-historial");
  historial.innerHTML = est.historial.length ? tablaResultados(est.historial.slice(0, 10)) : '<p class="gris">Todavía no has completado ningún reto.</p>';
  document.getElementById("saludo").textContent = nombre ? "Hola, " + nombre + "." : "Aún no has guardado tu nombre.";
  document.getElementById("nombre-jugador").value = nombre;
  actualizarAvatares();
}

// Al entrar al perfil: datos + editor de avatar (parte del avatar guardado)
function prepararPerfil() {
  mostrarDatosPerfil();
  if (window.AvatarCreator && document.getElementById("avatarCreator")) AvatarCreator.init("avatarCreator");
}

/* ----- Avatar guardado en otras páginas ----- */
function escaparHTML(texto) {
  return String(texto).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

// Avatar redondo pequeño. Devuelve "" si todavía no se guardó ningún avatar.
function avatarMini(tamano) {
  var config = window.AvatarGenerator ? AvatarGenerator.getSaved() : null;
  if (!config) return "";
  return '<span class="avatar-mini" style="width:' + tamano + 'px;height:' + tamano + 'px">' +
    AvatarGenerator.create(config, tamano, "cara") + "</span>";
}

// Pone el avatar guardado en el perfil y en el "TÚ" de Comunidad
function actualizarAvatares() {
  var perfil = document.getElementById("perfil-avatar-mini");
  if (perfil) perfil.innerHTML = avatarMini(96) || '<span class="avatar-vacio">Aún no tienes avatar: créalo más abajo.</span>';
  var tu = document.getElementById("comunidad-avatar");
  if (tu) tu.innerHTML = avatarMini(56) || "TÚ";
}
document.addEventListener("bz:avatar-saved", actualizarAvatares);   // aviso que lanza avatar.js al guardar

// Cabecera del resultado del reto: avatar y nombre (si existen)
function cabeceraJugador() {
  var nombre = leer("nombre", ""), avatar = avatarMini(64);
  if (!nombre && !avatar) return "";
  return '<div class="resultado-jugador">' + avatar + (nombre ? "<strong>" + escaparHTML(nombre) + "</strong>" : "") + "</div>";
}

// Valida el formulario del nombre antes de guardarlo
function guardarNombre(evento) {
  evento.preventDefault();
  var campo = document.getElementById("nombre-jugador");
  var nombre = campo.value.trim(), mensaje = "";
  if (nombre === "") mensaje = "Escribe tu nombre.";
  else if (nombre.length < 2 || nombre.length > 20) mensaje = "El nombre debe tener entre 2 y 20 caracteres.";
  else if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(nombre)) mensaje = "Usa solo letras y espacios.";
  document.getElementById("error-nombre").textContent = mensaje;
  campo.setAttribute("aria-invalid", mensaje ? "true" : "false");
  if (mensaje) return;
  guardar("nombre", nombre);
  mostrarDatosPerfil();   // no reinicia el editor de avatar: no se pierden cambios sin guardar
}
function borrarDatos() {
  if (confirm("¿Borrar tu nombre, tu progreso y tu mejor puntuación de este navegador?")) {
    try {
      localStorage.removeItem("basketZoneAvatar");
      localStorage.removeItem("lecciones");
      localStorage.removeItem("mejor");
      localStorage.removeItem("nombre"); localStorage.removeItem("estadisticas");
    } catch (e) {}

    prepararPerfil();
  }
}

/* ---------- 6. PARTIDOS (datos de demostración de data.js) ---------- */
function suma(lista) { return lista.reduce(function (t, n) { return t + n; }, 0); }

function prepararPartidos() {
  // Resultados: cada marcador se calcula sumando los cuartos y se anima con un contador
  document.getElementById("demo-resultados").innerHTML = RESULTADOS_DEMO.map(function (r) {
    var tl = suma(r.qLocal), tv = suma(r.qVisitante);
    function fila(nombre, cuartos, total, gana) {
      return "<tr" + (gana ? ' class="gana"' : "") + "><th scope='row'>" + nombre + "</th>" +
        cuartos.map(function (q) { return "<td>" + q + "</td>"; }).join("") +
        '<td><strong class="contador" data-valor="' + total + '" data-destello="1">' + total + "</strong></td></tr>";
    }
    return '<div class="caja" style="margin:12px 0"><p class="estado"><span class="punto fin"></span>' + r.jornada + " · Finalizado</p>" +
      '<div class="tabla-scroll"><table><thead><tr><th>Equipo</th><th>C1</th><th>C2</th><th>C3</th><th>C4</th><th>Total</th></tr></thead><tbody>' +
      fila(r.local, r.qLocal, tl, tl > tv) + fila(r.visitante, r.qVisitante, tv, tv > tl) + "</tbody></table></div></div>";
  }).join("");

  // Tabla de posiciones, con una barra animada de porcentaje de victorias
  document.getElementById("demo-tabla").innerHTML = '<div class="tabla-scroll"><table><thead><tr>' +
    "<th>#</th><th>Equipo</th><th>G</th><th>P</th><th>PF</th><th>PC</th><th>Dif.</th><th>Victorias</th></tr></thead><tbody>" +
    TABLA_DEMO.map(function (e, i) {
      var dif = (e.pf - e.pc).toFixed(1), pct = Math.round(e.g / (e.g + e.p) * 100);
      return "<tr><td>" + (i + 1) + "</td><th scope='row'>" + e.equipo + "</th><td>" + e.g + "</td><td>" + e.p + "</td><td>" +
        e.pf.toFixed(1) + "</td><td>" + e.pc.toFixed(1) + "</td><td>" + (dif > 0 ? "+" : "") + dif + "</td>" +
        '<td><div class="barra-mini" style="--ancho:' + pct + '%"><i></i></div></td></tr>';
    }).join("") + '</tbody></table></div><p class="gris">G = ganados, P = perdidos, PF y PC = puntos a favor y en contra por partido.</p>';

  // Próximos partidos
  document.getElementById("demo-proximos").innerHTML = '<div class="cuadricula">' + PROXIMOS_DEMO.map(function (m) {
    return '<div class="caja"><p class="estado"><span class="punto proximo"></span>Próximo · ' + m.cuando + "</p><h3>" + m.local +
      "</h3><p class='gris'>vs</p><h3>" + m.visitante + "</h3></div>";
  }).join("") + "</div>";
}

/* ---------- 7. JUGADORES (datos de demostración de data.js) ---------- */
function prepararJugadores() {
  // Tarjetas: al pasar el cursor (o enfocar con teclado) se revelan más estadísticas
  document.getElementById("demo-jugadores").innerHTML = JUGADORES_DEMO.map(function (j) {
    return '<div class="caja tarjeta-jugador" tabindex="0"><h3>' + j.nombre + '</h3><p class="gris">' + j.equipo + " · " + j.pos + "</p>" +
      '<p class="numero"><span class="contador" data-valor="' + j.pts + '" data-decimales="1">' + j.pts.toFixed(1) + '</span> <span class="gris" style="font-size:1rem">PTS</span></p>' +
      "<p>" + j.reb.toFixed(1) + " reb · " + j.ast.toFixed(1) + " ast · " + j.fg.toFixed(1) + "% TC</p>" +
      '<div class="detalle-extra"><p>Robos ' + j.stl.toFixed(1) + " · Tapones " + j.blk.toFixed(1) + "</p><p>Triples " + j.tp.toFixed(1) +
      "% · Tiros libres " + j.ft.toFixed(1) + '%</p></div><p class="gris">' + j.pj + " partidos · " + j.min.toFixed(1) + " min</p></div>";
  }).join("");

  // Líderes: el jugador con más en cada categoría
  document.getElementById("demo-lideres").innerHTML = ESTADISTICAS.slice(0, 5).map(function (e) {
    var lider = JUGADORES_DEMO.slice().sort(function (a, b) { return b[e[0]] - a[e[0]]; })[0];
    return '<div class="caja"><p class="gris">' + e[1] + "</p><p class='numero'><span class='contador' data-valor='" + lider[e[0]] +
      "' data-decimales='1'>" + lider[e[0]].toFixed(1) + "</span></p><p><strong>" + lider.nombre + '</strong></p><p class="gris">' + lider.equipo + "</p></div>";
  }).join("");

  // Comparador
  var opciones = JUGADORES_DEMO.map(function (j, i) { return '<option value="' + i + '">' + j.nombre + "</option>"; }).join("");
  var selA = document.getElementById("jug-a"), selB = document.getElementById("jug-b");
  selA.innerHTML = opciones; selB.innerHTML = opciones; selB.value = "1";
  compararJugadores();
}

function compararJugadores() {
  var a = JUGADORES_DEMO[document.getElementById("jug-a").value];
  var b = JUGADORES_DEMO[document.getElementById("jug-b").value];
  var filas = ESTADISTICAS.map(function (e) {
    var va = a[e[0]], vb = b[e[0]];
    return "<tr><td" + (va > vb ? ' class="mejor"' : "") + ">" + va.toFixed(1) + e[2] + "</td><th scope='row'>" + e[1] +
      "</th><td" + (vb > va ? ' class="mejor"' : "") + ">" + vb.toFixed(1) + e[2] + "</td></tr>";
  }).join("");
  document.getElementById("demo-comparacion").innerHTML = "<table class='comparacion'><thead><tr><th>" + a.nombre +
    "</th><th>Estadística</th><th>" + b.nombre + "</th></tr></thead><tbody>" + filas + "</tbody></table>" +
    '<p class="gris">Promedios por partido de la ' + TEMPORADA_DEMO + ". En naranja, el valor más alto.</p>";
}

/* ---------- 8. ANIMACIONES ----------
   Los efectos visuales están en styles.css (sección 15); aquí solo se activan.
   Si la persona usa "reducir movimiento", casi todo se desactiva. */
function reducido() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

// 8.1 Pantalla de carga: se oculta al terminar de cargar (mínimo 0,9 s para que se vea)
var inicioCarga = Date.now();
function ocultarCargador() {
  var cargador = document.getElementById("cargador");
  document.body.classList.add("cargado");          // la portada empieza a animarse
  if (!cargador || cargador.classList.contains("oculto")) return;
  cargador.classList.add("oculto");
  setTimeout(function () { cargador.remove(); }, 600);
}
window.addEventListener("load", function () {
  setTimeout(ocultarCargador, Math.max(0, 900 - (Date.now() - inicioCarga)));
});
setTimeout(ocultarCargador, 4000);                 // seguridad: nunca bloquea la web

// 8.2 Aparición al desplazarse (Intersection Observer)
var observadorRevelar = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entradas) {
  entradas.forEach(function (e) {
    if (e.isIntersecting) { e.target.classList.add("visible"); observadorRevelar.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }) : null;

// Elementos que aparecen progresivamente (añade aquí otros selectores si quieres)
var SELECTOR_REVELAR = "h2, .caja, details, .linea-tiempo li, .glosario dt, tbody tr, .diagrama, .flujo, .pasos li, .aviso";

function animarAlDesplazar(pagina) {
  var lista = Array.prototype.slice.call(pagina.querySelectorAll(SELECTOR_REVELAR)).filter(function (el) {
    return !el.closest(".portada");
  });
  // Si un elemento está dentro de otro que ya se anima, solo se anima el exterior
  lista = lista.filter(function (el) {
    return !lista.some(function (otro) { return otro !== el && otro.contains(el); });
  });
  lista.forEach(function (el, i) {
    el.classList.add("revelar");
    el.classList.remove("visible");
    el.style.setProperty("--retraso", (i % 5) * 0.07 + "s");   // aparición escalonada
    if (reducido() || !observadorRevelar) el.classList.add("visible");
    else observadorRevelar.observe(el);
  });
  activarContadores(pagina);
}

// 8.3 Contadores animados: elementos con class="contador" y data-valor="número"
//     Opcionales: data-decimales="1", data-coma="1" (coma decimal), data-destello="1"
function formato(numero, decimales, coma) {
  var texto = numero.toFixed(decimales);
  return coma ? texto.replace(".", ",") : texto;
}

function contar(el) {
  var meta = parseFloat(el.dataset.valor), dec = parseInt(el.dataset.decimales || "0", 10);
  var coma = el.dataset.coma === "1", inicio = null, duracion = 900;
  function paso(t) {
    if (inicio === null) inicio = t;
    var avance = Math.min((t - inicio) / duracion, 1);
    el.textContent = formato(meta * (1 - Math.pow(1 - avance, 3)), dec, coma);
    if (avance < 1) requestAnimationFrame(paso);
    else if (el.dataset.destello === "1") el.classList.add("destello");   // destello al fijar el marcador
  }
  requestAnimationFrame(paso);
}

var observadorContadores = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entradas) {
  entradas.forEach(function (e) {
    if (e.isIntersecting) { contar(e.target); observadorContadores.unobserve(e.target); }
  });
}, { threshold: 0.4 }) : null;

function activarContadores(raiz) {
  if (reducido() || !observadorContadores) return;   // se queda el valor final escrito en el HTML
  raiz.querySelectorAll(".contador").forEach(function (el) {
    el.classList.remove("destello");
    el.textContent = formato(0, parseInt(el.dataset.decimales || "0", 10), el.dataset.coma === "1");
    observadorContadores.observe(el);
  });
}

// 8.4 Parallax discreto: los elementos con data-parallax="0.06" se mueven un poco al hacer scroll
function actualizarParallax() {
  var activo = !reducido() && window.innerWidth > 800;
  document.querySelectorAll(".pagina.activa [data-parallax]").forEach(function (el) {
    el.style.transform = activo ? "translate3d(0," + (window.scrollY * parseFloat(el.dataset.parallax)).toFixed(1) + "px,0)" : "";
  });
}
var parallaxPendiente = false;
window.addEventListener("scroll", function () {
  if (parallaxPendiente) return;
  parallaxPendiente = true;
  requestAnimationFrame(function () { parallaxPendiente = false; actualizarParallax(); });
}, { passive: true });

/* ---------- 8.5 FICHAS INTERACTIVAS DE BZ ACADEMY ---------- */
var CONTENIDO_TEMAS = {
  "fundamentos-reglamento": [
    "El reglamento organiza el partido para que ambos equipos compitan en condiciones claras. En las reglas FIBA, el juego tiene cuatro periodos de 10 minutos y cada equipo juega con cinco participantes en cancha.",
    "Recuerda las reglas más comunes: pasos, dobles, fuera de banda, faltas y tiempo de posesión.",
    "reglas basicas baloncesto FIBA explicacion español"
  ],
  "fundamentos-la-cancha": [
    "La cancha FIBA es rectangular y mide 28 metros de largo por 15 de ancho. Sus líneas delimitan el terreno y ayudan a reconocer zonas como el área restringida, la línea de tiro libre, el círculo central y la línea de tres puntos.",
    "La línea de tres puntos marca la zona desde la que un lanzamiento convertido vale tres puntos; dentro de ella, normalmente vale dos.",
    "lineas y zonas de la cancha de baloncesto medidas FIBA"
  ],
  "fundamentos-posiciones": [
    "Las cinco posiciones tradicionales son base, escolta, alero, ala-pívot y pívot. El base suele organizar el ataque, el escolta aporta manejo y lanzamiento, el alero combina funciones, el ala-pívot juega cerca y lejos del aro, y el pívot suele actuar cerca de la canasta.",
    "Las posiciones son referencias: en el baloncesto actual los jugadores pueden cumplir varias funciones.",
    "posiciones del baloncesto base escolta alero ala pivot pivot explicacion"
  ],
  "fundamentos-puntuacion": [
    "Una canasta puede sumar uno, dos o tres puntos. El tiro libre vale un punto, un lanzamiento convertido dentro de la línea de tres vale dos y uno convertido desde fuera de esa línea vale tres.",
    "La ubicación del jugador al soltar el balón determina si el lanzamiento es de dos o de tres puntos.",
    "como funciona la puntuacion en baloncesto tiros libres dobles triples"
  ],
  "fundamentos-faltas-y-violaciones": [
    "Una falta suele implicar un contacto ilegal o una conducta antideportiva. Una violación ocurre cuando se incumple una regla de movimiento o posesión, como cometer pasos, dobles o salir con el balón fuera de la cancha.",
    "No todas las infracciones se sancionan igual: una falta puede generar tiros libres según la situación.",
    "faltas y violaciones del baloncesto pasos dobles FIBA explicacion"
  ],
  "fundamentos-equipamiento": [
    "Para jugar se necesita una cancha con dos canastas, un balón adecuado a la categoría y ropa deportiva que permita moverse con seguridad. También se utilizan zapatillas con buen agarre y, según el contexto, elementos de protección.",
    "El balón debe tener el tamaño apropiado para la edad y categoría de los jugadores.",
    "equipamiento necesario para jugar baloncesto explicacion"
  ],
  "tecnicas-dribling": [
    "El dribling es el avance con el balón mediante botes continuos contra el suelo. Se controla con las yemas de los dedos, las rodillas flexionadas y la mirada al frente.",
    "Practica con ambas manos y cambia de ritmo sin perder el control.",
    "tecnica de dribling baloncesto para principiantes"
  ],
  "tecnicas-pases": [
    "El pase permite mover el balón entre compañeros. El pase de pecho viaja directo, el picado rebota en el suelo y el pase por encima de la cabeza sirve para superar a un defensor.",
    "Da el pase hacia el espacio donde tu compañero pueda recibirlo con ventaja.",
    "tipos de pases en baloncesto pase pecho picado explicacion"
  ],
  "tecnicas-lanzamientos": [
    "Para lanzar, coloca los pies en una posición estable, mira el aro, alinea el codo con el balón y termina extendiendo el brazo y la muñeca. Las piernas ayudan a generar fuerza.",
    "La repetición con una técnica equilibrada es más importante que lanzar desde muy lejos.",
    "tecnica de lanzamiento baloncesto fundamentos tiro"
  ],
  "tecnicas-entradas": [
    "La entrada a canasta es un movimiento para acercarse al aro y finalizar, normalmente después de avanzar botando. En una entrada clásica se coordinan los dos últimos pasos con el salto y la finalización.",
    "Practica primero sin defensa y a velocidad controlada, alternando ambos lados.",
    "como hacer una entrada a canasta baloncesto pasos"
  ],
  "tecnicas-defensa": [
    "La defensa individual busca impedir que un atacante avance o reciba con comodidad. Mantén una postura baja, los brazos activos y desplázate lateralmente sin cruzar los pies.",
    "Colócate entre tu rival y el aro, sin perder el equilibrio ni realizar contactos ilegales.",
    "posicion defensiva individual baloncesto desplazamiento lateral"
  ],
  "tecnicas-rebotes": [
    "El rebote consiste en recuperar el balón después de un lanzamiento fallido. Para ganar posición, observa el tiro, bloquea el avance del rival y salta con ambas manos hacia el balón.",
    "Primero busca una buena posición; después intenta atrapar el balón con firmeza.",
    "como hacer rebotes en baloncesto box out explicacion"
  ],
  "estrategias-ataque-organizado": [
    "En un ataque organizado, los jugadores ocupan espacios y mueven el balón para encontrar un lanzamiento con ventaja. Los cortes, pases y bloqueos ayudan a desordenar la defensa.",
    "Después de pasar, no te quedes quieto: corta hacia el aro o busca un espacio libre.",
    "ataque organizado baloncesto movimientos ofensivos basicos"
  ],
  "estrategias-contraataque": [
    "El contraataque es una transición rápida desde la defensa hacia el ataque, normalmente después de recuperar el balón. Los jugadores corren por carriles y buscan una opción clara antes de que la defensa se organice.",
    "Avanza rápido, pero controla el balón y elige si conviene pasar o finalizar.",
    "contraataque baloncesto explicacion transicion ofensiva"
  ],
  "estrategias-defensa-individual": [
    "En la defensa individual cada jugador se responsabiliza principalmente de marcar a un oponente. El equipo debe mantener comunicación y ayudar si un atacante supera a su defensor.",
    "Defender no es solo seguir al balón: también hay que observar al jugador asignado.",
    "defensa individual hombre a hombre baloncesto explicacion"
  ],
  "estrategias-defensa-en-zona": [
    "En la defensa en zona cada jugador protege un sector de la cancha en lugar de seguir siempre a un rival específico. La formación puede cambiar según la estrategia del equipo.",
    "La comunicación es esencial para cubrir espacios y evitar que un atacante quede libre.",
    "defensa en zona 2-3 baloncesto explicacion"
  ],
  "estrategias-bloqueos": [
    "Un bloqueo es una posición legal que ocupa un atacante para dificultar el camino del defensor y liberar a un compañero. Puede generar espacio para un tiro, una penetración o un pase.",
    "El jugador que bloquea debe estar quieto al establecer la posición y evitar el contacto ilegal.",
    "bloqueo directo pick and roll baloncesto explicado"
  ],
  "estrategias-trabajo-colectivo": [
    "El trabajo colectivo combina pases, movimientos, comunicación y apoyo entre los cinco jugadores. Una buena decisión individual puede crear oportunidades para todo el equipo.",
    "El balón suele moverse más rápido que un jugador: compartirlo puede abrir mejores opciones.",
    "importancia del trabajo en equipo baloncesto movimientos"
  ],
  "preparacion-coordinacion": [
    "La coordinación permite combinar movimientos del cuerpo con el control del balón. En baloncesto aparece al botar mientras corres, recibir un pase o cambiar de dirección.",
    "Empieza con ejercicios sencillos y aumenta la dificultad poco a poco.",
    "ejercicios coordinacion baloncesto con balon"
  ],
  "preparacion-velocidad": [
    "La velocidad ayuda a acelerar, frenar y cambiar de dirección durante el partido. También incluye reaccionar rápido ante un pase, un rebote o una acción defensiva.",
    "Trabaja la técnica de carrera y los cambios de dirección con descansos suficientes.",
    "entrenamiento velocidad baloncesto cambios direccion"
  ],
  "preparacion-resistencia": [
    "La resistencia permite mantener el esfuerzo durante los cuatro periodos. Se desarrolla combinando actividad aeróbica, ejercicios específicos del deporte y recuperación adecuada.",
    "Aumenta la intensidad gradualmente y adapta el entrenamiento a tu condición física.",
    "resistencia fisica para baloncesto ejercicios"
  ],
  "preparacion-movilidad": [
    "La movilidad es la capacidad de mover las articulaciones con control y amplitud. Ayuda a realizar posiciones bajas, giros y desplazamientos con una técnica adecuada.",
    "No fuerces una articulación ni confundas movilidad con estirar hasta sentir dolor.",
    "rutina movilidad articular baloncesto calentamiento"
  ],
  "preparacion-equilibrio": [
    "El equilibrio permite mantener la estabilidad al saltar, aterrizar, girar o recibir contacto. Se relaciona con el control del tronco y la posición de los pies.",
    "Practica aterrizajes suaves y estables, con las rodillas alineadas con los pies.",
    "ejercicios equilibrio baloncesto estabilidad"
  ],
  "preparacion-calentamiento": [
    "El calentamiento prepara progresivamente al cuerpo antes de entrenar. Puede incluir movilidad dinámica, desplazamientos suaves, cambios de dirección y ejercicios con balón.",
    "Comienza suave y aumenta la intensidad; detente si sientes dolor o mareo.",
    "calentamiento dinamico antes de jugar baloncesto"
  ],
  "estadisticas-puntos": [
    "Los puntos registran cuánto aporta un jugador o equipo al marcador. Se pueden separar en tiros libres, canastas de dos y triples para entender cómo se consiguieron.",
    "Compara los puntos con los minutos jugados y la cantidad de lanzamientos para tener más contexto.",
    "estadistica puntos baloncesto como analizar"
  ],
  "estadisticas-rebotes": [
    "Los rebotes registran cuántos balones recupera un jugador después de un lanzamiento fallido. Se dividen en rebotes ofensivos y defensivos según el aro donde ocurre la acción.",
    "Un rebote defensivo ayuda a terminar la posesión rival; uno ofensivo puede dar otra oportunidad de anotar.",
    "estadistica rebotes ofensivos defensivos baloncesto"
  ],
  "estadisticas-asistencias": [
    "Una asistencia se registra cuando un pase ayuda directamente a que un compañero anote. Refleja la creación de oportunidades y la colaboración ofensiva.",
    "No todo pase antes de una canasta es una asistencia: debe contribuir directamente a la anotación.",
    "que es una asistencia en baloncesto estadistica"
  ],
  "estadisticas-robos": [
    "Un robo ocurre cuando un defensor consigue la posesión del balón al interceptar un pase o quitárselo legalmente al rival.",
    "Un buen robo requiere anticipación y control; evitar faltas es tan importante como recuperar el balón.",
    "que es un robo en baloncesto estadistica"
  ],
  "estadisticas-tapones": [
    "Un tapón se produce cuando un defensor desvía o bloquea legalmente un lanzamiento del rival. Es una acción defensiva que puede evitar una canasta.",
    "El defensor debe tocar el balón sin cometer falta y respetar las reglas sobre el balón en trayectoria descendente.",
    "que es un tapon en baloncesto reglas"
  ],
  "estadisticas-porcentajes": [
    "Los porcentajes muestran la proporción de lanzamientos convertidos respecto de los intentados. Por ejemplo, 5 aciertos en 10 intentos equivalen al 50 %.",
    "Siempre revisa también cuántos tiros se intentaron: el porcentaje sin cantidad puede dar una idea incompleta.",
    "porcentaje tiros baloncesto FG porcentaje explicacion"
  ],
  "mentalidad-comunicacion": [
    "La comunicación ayuda a coordinar al equipo. Los jugadores avisan sobre bloqueos, cambios defensivos, pases y compañeros libres con mensajes breves y claros.",
    "Habla con respeto y a tiempo: una indicación útil puede prevenir un error.",
    "comunicacion en equipo baloncesto defensa"
  ],
  "mentalidad-concentracion": [
    "La concentración permite prestar atención al balón, los compañeros, los rivales y las indicaciones del entrenador. También ayuda a recuperarse mentalmente después de un error.",
    "Concéntrate en la siguiente acción en vez de quedarte pensando en una jugada que ya terminó.",
    "concentracion mental deportistas baloncesto"
  ],
  "mentalidad-liderazgo": [
    "El liderazgo consiste en ayudar al equipo a mantener el esfuerzo, la organización y una actitud positiva. No depende únicamente de ser el capitán o el jugador con más puntos.",
    "Un líder escucha, da el ejemplo y anima a sus compañeros sin descalificarlos.",
    "liderazgo trabajo en equipo deporte baloncesto"
  ],
  "mentalidad-disciplina": [
    "La disciplina se demuestra al respetar las reglas, asistir a los entrenamientos, cuidar el material y mantener hábitos responsables dentro y fuera de la cancha.",
    "La constancia en pequeñas acciones ayuda a mejorar con el tiempo.",
    "disciplina deportiva baloncesto habitos entrenamiento"
  ],
  "mentalidad-decisiones": [
    "Durante el juego hay que decidir rápidamente si conviene pasar, lanzar, botar o defender. La mejor opción depende de la posición de los compañeros, los rivales y el tiempo disponible.",
    "Antes de recibir el balón, observa la cancha para anticipar tus opciones.",
    "toma de decisiones baloncesto lectura de juego"
  ],
  "mentalidad-companerismo": [
    "El compañerismo significa confiar, apoyar y colaborar con los demás. En baloncesto se demuestra compartiendo el balón, ayudando en defensa y respetando las diferencias.",
    "Reconoce el esfuerzo de tus compañeros y mantén una actitud respetuosa incluso al perder.",
    "companerismo trabajo en equipo baloncesto valores"
  ]
};

function svgJugador(x, y, numero, color, etiqueta) {
  return '<g class="svg-jugador"><circle cx="' + x + '" cy="' + y + '" r="15" fill="' + color + '" stroke="#09090B" stroke-width="2"/><text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" font-size="13" font-weight="900" fill="#09090B">' + numero + '</text>' +
    (etiqueta ? '<text x="' + x + '" y="' + (y + 29) + '" text-anchor="middle" font-size="10" font-weight="800" fill="#F4F4F2">' + etiqueta + '</text>' : '') + '</g>';
}
function svgFlecha(d, tipo) {
  return '<path d="' + d + '" class="' + (tipo || 'svg-ruta') + '" fill="none" stroke="#F47721" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="7 5" marker-end="url(#bz-flecha)"/>'; 
}
function svgCanchaBase(contenido, titulo, descripcion) {
  return '<svg viewBox="0 0 520 300" role="img" aria-label="' + titulo + '" class="bz-diagrama-tactico">' +
    '<title>' + titulo + '</title><desc>' + descripcion + '</desc>' +
    '<defs><marker id="bz-flecha" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#F47721" stroke-width="1.5"/></marker><marker id="bz-flecha-clara" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#F4F4F2" stroke-width="1.5"/></marker></defs>' +
    '<rect x="10" y="16" width="500" height="268" rx="5" fill="#A96F43" stroke="#F4F4F2" stroke-width="3"/>' +
    '<g fill="none" stroke="#F4F4F2" stroke-width="2.2" opacity=".95">' +
      '<path d="M260 16V284"/><circle cx="260" cy="150" r="32"/>' +
      '<rect x="10" y="106" width="104" height="88"/><rect x="406" y="106" width="104" height="88"/>' +
      '<path d="M114 106a44 44 0 0 1 0 88M406 106a44 44 0 0 0 0 88"/>' +
      '<path d="M10 32H61M10 268H61M459 32H510M459 268H510"/>' +
      '<path d="M61 32A120 120 0 0 1 61 268M459 32A120 120 0 0 0 459 268" stroke-width="2.5"/>' +
      '<path d="M29 132V168M491 132V168" stroke="#F4F4F2" stroke-width="4"/><circle cx="38" cy="150" r="7" stroke="#F47721" stroke-width="3"/><circle cx="482" cy="150" r="7" stroke="#F47721" stroke-width="3"/>' +
    '</g>' +
    '<g font-size="9" font-weight="800"><circle cx="18" cy="9" r="4" fill="#F47721"/><text x="27" y="12" fill="#F4F4F2">ATAQUE</text><circle cx="91" cy="9" r="4" fill="#F4F4F2"/><text x="100" y="12" fill="#F4F4F2">DEFENSA</text></g>' + contenido + '</svg>'; 
}
function graficoTema(id) {
  var grafico = '', pie = '';
  // Imágenes aportadas para los temas. Los temas sin imagen conservan sus diagramas SVG.
  var imagenesTema = {
    'fundamentos-posiciones': ['assets/img/posiciones-jugadores.jpg', 'Posiciones de los cinco jugadores de baloncesto'],
    'estrategias-ataque-organizado': ['assets/img/ataque-organizado.jpg', 'Ejemplo de ataque organizado en baloncesto'],
    'estrategias-contraataque': ['assets/img/contraataque.png', 'Ejemplo de contraataque en baloncesto'],
    'estrategias-defensa-en-zona': ['assets/img/defensa-zonal.jpg', 'Distribución de la defensa en zona'],
    'estrategias-bloqueos': ['assets/img/bloqueos.jpg', 'Ejemplo de bloqueo en baloncesto'],
    'fundamentos-la-cancha': ['assets/img/cancha-de-baloncesto.png', 'Cancha de baloncesto'],
    'estrategias-defensa-individual': ['assets/img/defensa-individual.png', 'Ejemplo de defensa individual en baloncesto'],
    'estrategias-trabajo-colectivo': ['assets/img/trabajo-organizado.png', 'Ejemplo de trabajo colectivo en baloncesto']
  };
  if (imagenesTema[id]) {
    var imagenTema = imagenesTema[id];
    return '<img src="' + imagenTema[0] + '" class="tema-imagen" alt="' + imagenTema[1] + '" loading="lazy">';
  }
  if (id === 'fundamentos-la-cancha') {
    grafico = '<svg viewBox="0 0 620 360" role="img" aria-label="Cancha FIBA completa de 28 por 15 metros con líneas y zonas reglamentarias" class="grafico-cancha bz-cancha-fiba">' +
      '<title>Cancha de baloncesto FIBA: 28 por 15 metros</title><desc>Vista superior de una cancha completa con línea central, círculo central, áreas restringidas, líneas de tiro libre, canastas y arcos de tres puntos.</desc>' +
      '<defs><marker id="bz-dimension-arrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto-start-reverse"><path d="M7 0L0 3.5L7 7" fill="none" stroke="#F4F4F2" stroke-width="1"/></marker></defs><g transform="translate(40 16)">' +
      '<rect x="14" y="22" width="532" height="285" rx="3" fill="#A96F43" stroke="#F4F4F2" stroke-width="3"/>' +
      '<g fill="none" stroke="#F4F4F2" stroke-width="2.4"><path d="M280 22V307"/><circle cx="280" cy="164.5" r="34.2"/>' +
      '<rect x="14" y="118" width="110" height="93"/><rect x="436" y="118" width="110" height="93"/>' +
      '<path d="M124 118a46.5 46.5 0 0 1 0 93M436 118a46.5 46.5 0 0 0 0 93"/>' +
      '<path d="M14 39H70M14 290H70M490 39H546M490 290H546"/>' +
      '<path d="M70 39A128.25 128.25 0 0 1 70 290M490 39A128.25 128.25 0 0 0 490 290"/>' +
      '<path d="M37 150V179M523 150V179" stroke="#F4F4F2" stroke-width="4"/><circle cx="44" cy="164.5" r="7.5" stroke="#F47721" stroke-width="3"/><circle cx="516" cy="164.5" r="7.5" stroke="#F47721" stroke-width="3"/></g>' +
      '<g fill="#09090B" font-size="10" font-weight="900"><text x="18" y="111">ÁREA RESTRINGIDA</text><text x="438" y="111">ÁREA RESTRINGIDA</text></g>' +
      '<g fill="#F4F4F2" font-size="10" font-weight="800"><text x="18" y="301">LÍNEA DE FONDO</text><text x="430" y="301">LÍNEA DE FONDO</text><text x="280" y="158" text-anchor="middle">CÍRCULO</text><text x="280" y="171" text-anchor="middle">CENTRAL</text><text x="220" y="34">LÍNEA CENTRAL</text></g>' +
      '<g fill="#09090B" font-size="9" font-weight="800"><text x="18" y="51">ARCO DE 3 PUNTOS</text><text x="440" y="51">ARCO DE 3 PUNTOS</text></g>' +
      '</g><g fill="none" stroke="#F4F4F2" stroke-width="1.4"><path d="M54 23H586" marker-start="url(#bz-dimension-arrow)" marker-end="url(#bz-dimension-arrow)"/><path d="M34 38V323" marker-start="url(#bz-dimension-arrow)" marker-end="url(#bz-dimension-arrow)"/></g>' +
      '<g fill="#F4F4F2" font-size="11" font-weight="900"><text x="320" y="18" text-anchor="middle">28 m</text><text x="23" y="180" text-anchor="middle" transform="rotate(-90 23 180)">15 m</text></g></svg>';
    pie = 'Medidas oficiales FIBA: 28 m de largo por 15 m de ancho. Es un esquema proporcional simplificado; las líneas muestran las zonas principales.';
  } else if (id === 'fundamentos-posiciones') {
    var cp = '<g fill="none" stroke="#F47721" stroke-width="2" stroke-dasharray="5 5"><path d="M320 150L355 75M320 150L355 225M320 150L430 75M320 150L430 225"/></g>' +
      svgJugador(320,150,'1','#F47721','BASE') + svgJugador(355,75,'2','#F47721','ESCOLTA') + svgJugador(355,225,'3','#F47721','ALERO') + svgJugador(430,75,'4','#F47721','ALA-PÍVOT') + svgJugador(430,225,'5','#F47721','PÍVOT');
    grafico = svgCanchaBase(cp,'Ubicación orientativa de las cinco posiciones','Los cinco jugadores se distribuyen en distintas zonas de ataque. Las posiciones son referencias funcionales y pueden cambiar durante el juego.');
    pie = 'Distribución ofensiva ilustrativa: 1 base, 2 escolta, 3 alero, 4 ala-pívot y 5 pívot. No son posiciones fijas: dependen del sistema y de la jugada.';
  } else if (id === 'estrategias-ataque-organizado') {
    var c = svgFlecha('M290 150Q330 90 365 72') + svgFlecha('M365 72Q405 78 430 118') + svgFlecha('M430 118Q430 175 390 218') + svgFlecha('M390 218Q330 225 290 150') +
      svgJugador(290,150,'1','#F47721','BASE') + svgJugador(365,72,'2','#F47721','ESCOLTA') + svgJugador(430,118,'3','#F47721','ALERO') + svgJugador(390,218,'4','#F47721','ALA-PÍVOT') + svgJugador(465,150,'5','#F47721','PÍVOT');
    grafico = svgCanchaBase(c,'Ataque organizado y circulación del balón','Los jugadores mantienen espacios y se mueven después de pasar para crear una oportunidad de lanzamiento.');
    pie = 'Ejemplo de circulación: pasar, moverse y ocupar un espacio libre. Las flechas muestran desplazamientos o circulación, no una jugada obligatoria.';
  } else if (id === 'estrategias-contraataque') {
    var c = '<g fill="none" stroke="#F47721" stroke-width="4" stroke-dasharray="7 5"><path d="M115 150C210 150 300 90 440 90" marker-end="url(#bz-flecha)"/><path d="M115 150C230 150 310 150 450 150" marker-end="url(#bz-flecha)"/><path d="M115 150C210 150 300 210 440 210" marker-end="url(#bz-flecha)"/></g>' +
      svgJugador(115,150,'1','#F47721','REBOTE') + svgJugador(250,88,'2','#F47721','CARRIL') + svgJugador(270,150,'3','#F47721','BALÓN') + svgJugador(250,212,'4','#F47721','CARRIL') + svgJugador(440,150,'5','#F47721','FINALIZA');
    grafico = svgCanchaBase(c,'Contraataque por tres carriles','Tras recuperar el balón, el equipo avanza rápido y ocupa carriles separados para ofrecer opciones de pase.');
    pie = 'El jugador con balón avanza y sus compañeros corren abiertos por los carriles laterales. Si la defensa se repliega, el equipo puede frenar y organizar el ataque.';
  } else if (id === 'estrategias-defensa-individual') {
    var c = '<g stroke="#F4F4F2" stroke-width="2" stroke-dasharray="4 4" opacity=".9"><path d="M300 80L330 95M360 65L385 82M405 120L430 135M390 215L420 225M460 155L480 165"/></g>' +
      svgJugador(300,80,'1','#F47721','') + svgJugador(360,65,'2','#F47721','') + svgJugador(405,120,'3','#F47721','') + svgJugador(390,215,'4','#F47721','') + svgJugador(460,155,'5','#F47721','') +
      svgJugador(330,95,'A','#F4F4F2','') + svgJugador(385,82,'B','#F4F4F2','') + svgJugador(430,135,'C','#F4F4F2','') + svgJugador(420,225,'D','#F4F4F2','') + svgJugador(480,165,'E','#F4F4F2','');
    grafico = svgCanchaBase(c,'Defensa individual: emparejamientos','Cada defensor se responsabiliza de un atacante. Las líneas punteadas representan la asignación inicial de marca.');
    pie = 'Cada defensor sigue a un rival, pero debe ayudar y recuperar su marca cuando hay bloqueos o penetraciones. La comunicación evita dejar espacios libres.';
  } else if (id === 'estrategias-defensa-en-zona') {
    var c = '<g fill="none" stroke="#F4F4F2" stroke-width="2" stroke-dasharray="5 5"><path d="M365 105L450 80M365 105L450 150M365 195L450 150M365 195L450 220"/></g>' +
      svgJugador(365,105,'1','#F4F4F2','') + svgJugador(365,195,'2','#F4F4F2','') + svgJugador(450,70,'3','#F4F4F2','') + svgJugador(465,150,'4','#F4F4F2','') + svgJugador(450,230,'5','#F4F4F2','') +
      svgJugador(280,75,'A','#F47721','') + svgJugador(300,150,'B','#F47721','') + svgJugador(280,225,'C','#F47721','');
    grafico = svgCanchaBase(c,'Defensa en zona 2-3','Dos defensores protegen la parte exterior y tres jugadores cubren zonas cercanas a la canasta.');
    pie = 'La formación 2-3 es un ejemplo habitual: dos jugadores arriba y tres cerca de la zona. El equipo se desplaza junto con el balón para cerrar espacios.';
  } else if (id === 'estrategias-bloqueos') {
    var c = '<path d="M315 150L355 150" stroke="#F4F4F2" stroke-width="5" stroke-linecap="round"/><path d="M315 150L430 90" stroke="#F47721" stroke-width="3" fill="none" marker-end="url(#bz-flecha)"/><path d="M355 150Q390 190 430 205" stroke="#F47721" stroke-width="3" fill="none" marker-end="url(#bz-flecha)"/>' +
      svgJugador(315,150,'1','#F47721','BALÓN') + svgJugador(355,150,'5','#F47721','BLOQUEO') + svgJugador(335,105,'D','#F4F4F2','DEFENSOR') + svgJugador(430,90,'2','#F47721','TIRO') + svgJugador(430,205,'5','#F47721','CONTINÚA');
    grafico = svgCanchaBase(c,'Bloqueo directo y continuación','Un atacante bloquea al defensor del jugador con balón. Después, el jugador que bloquea puede continuar hacia el aro.');
    pie = 'Ejemplo de pick and roll: el jugador que bloquea establece una posición legal y luego se desplaza hacia el aro. El jugador con balón lee la defensa para pasar, penetrar o lanzar.';
  } else if (id === 'estrategias-trabajo-colectivo') {
    var c = svgFlecha('M290 150L365 70') + svgFlecha('M365 70L435 150') + svgFlecha('M435 150L365 225') + svgFlecha('M365 225L290 150') +
      '<path d="M290 150Q350 190 435 150" fill="none" stroke="#F4F4F2" stroke-width="2" stroke-dasharray="5 5" marker-end="url(#bz-flecha-clara)"/>' +
      svgJugador(290,150,'1','#F47721','PASE') + svgJugador(365,70,'2','#F47721','ABRE') + svgJugador(435,150,'3','#F47721','RECIBE') + svgJugador(365,225,'4','#F47721','CORTA') + svgJugador(465,150,'5','#F47721','APOYA');
    grafico = svgCanchaBase(c,'Trabajo colectivo: pasar y moverse','Los cinco jugadores se ofrecen como opciones de pase, ocupan espacios y coordinan cortes hacia la canasta.');
    pie = 'El movimiento sin balón es tan importante como el pase. Después de pasar, busca un espacio, realiza un corte o ayuda a un compañero.';
  }
  if (!grafico) return '';
  return grafico + '<p class="tema-grafico-pie">' + pie + '</p>';
}


var CONSULTAS_VIDEO_EN = {
  "fundamentos-reglamento":"FIBA basketball rules explained for beginners", "fundamentos-la-cancha":"FIBA basketball court dimensions lines markings 28 by 15 meters", "fundamentos-posiciones":"basketball positions point guard shooting guard small forward power forward center", "fundamentos-puntuacion":"basketball scoring one two three points free throws", "fundamentos-faltas-y-violaciones":"basketball fouls and violations traveling double dribble", "fundamentos-equipamiento":"basketball equipment ball shoes uniform explained",
  "tecnicas-dribling":"basketball dribbling fundamentals beginner tutorial", "tecnicas-pases":"basketball passing chest bounce overhead pass tutorial", "tecnicas-lanzamientos":"basketball shooting form fundamentals tutorial", "tecnicas-entradas":"basketball layup footwork two step finish tutorial", "tecnicas-defensa":"basketball defensive stance lateral slides tutorial", "tecnicas-rebotes":"basketball rebounding box out technique tutorial",
  "estrategias-ataque-organizado":"basketball offensive spacing ball movement set offense", "estrategias-contraataque":"basketball fast break transition offense lanes", "estrategias-defensa-individual":"basketball man to man defense positioning help defense", "estrategias-defensa-en-zona":"basketball 2-3 zone defense positioning rotations", "estrategias-bloqueos":"basketball pick and roll screen and roll explained", "estrategias-trabajo-colectivo":"basketball team offense passing cutting off ball movement",
  "preparacion-coordinacion":"basketball coordination drills with ball", "preparacion-velocidad":"basketball speed agility change of direction drills", "preparacion-resistencia":"basketball conditioning endurance training drills", "preparacion-movilidad":"basketball dynamic mobility warm up routine", "preparacion-equilibrio":"basketball balance landing stability drills", "preparacion-calentamiento":"basketball dynamic warm up before practice",
  "estadisticas-puntos":"basketball points scoring statistics explained", "estadisticas-rebotes":"basketball offensive defensive rebounds statistics explained", "estadisticas-asistencias":"basketball assists statistic explained", "estadisticas-robos":"basketball steals statistic explained", "estadisticas-tapones":"basketball blocks statistic explained", "estadisticas-porcentajes":"basketball field goal percentage shooting stats explained",
  "mentalidad-comunicacion":"basketball team communication on court defense calls", "mentalidad-concentracion":"basketball mental focus concentration sports psychology", "mentalidad-liderazgo":"leadership in basketball team sports", "mentalidad-disciplina":"basketball practice discipline habits consistency", "mentalidad-decisiones":"basketball decision making read the game court vision", "mentalidad-companerismo":"basketball teamwork sportsmanship supporting teammates"
};

function abrirFichaTema(id) {
  var tema = CONTENIDO_TEMAS[id];
  if (!tema) return;
  var tarjeta = document.querySelector('[data-tema="' + id + '"]');
  var titulo = tarjeta ? tarjeta.querySelector('h3').textContent : id;
  var dialogo = document.getElementById("tema-dialog");
  document.getElementById("tema-dialog-titulo").textContent = titulo;
  document.getElementById("tema-dialog-intro").textContent = tema[0];
  document.getElementById("tema-dialog-grafico").innerHTML = graficoTema(id);
  document.getElementById("tema-dialog-clave").innerHTML = '<strong>EN LA CANCHA</strong><p>' + tema[1] + '</p>';
  var videoEspanol = document.getElementById("tema-dialog-video-es");
  var videoIngles = document.getElementById("tema-dialog-video-en");
  videoEspanol.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(tema[2] + ' español');
  videoIngles.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(CONSULTAS_VIDEO_EN[id] || ('basketball ' + titulo + ' tutorial'));
  videoEspanol.textContent = 'Videos en español: ' + titulo + ' ↗';
  videoIngles.textContent = 'Videos in English: ' + titulo + ' ↗';
  if (typeof dialogo.showModal === "function") dialogo.showModal();
  else dialogo.setAttribute("open", "open");
}

document.addEventListener("click", function (evento) {
  var tarjeta = evento.target.closest("[data-tema]");
  if (tarjeta) abrirFichaTema(tarjeta.dataset.tema);
});
document.addEventListener("keydown", function (evento) {
  var tarjeta = evento.target.closest && evento.target.closest("[data-tema]");
  if (tarjeta && (evento.key === "Enter" || evento.key === " ")) {
    evento.preventDefault();
    abrirFichaTema(tarjeta.dataset.tema);
  }
});
document.getElementById("tema-dialog-cerrar").addEventListener("click", function () {
  var dialogo = document.getElementById("tema-dialog");
  if (typeof dialogo.close === "function") dialogo.close();
  else dialogo.removeAttribute("open");
});
document.getElementById("tema-dialog").addEventListener("click", function (evento) {
  if (evento.target === this) this.close();
});

/* ---------- 9. ARRANQUE ---------- */
// Eventos de elementos fijos (se conectan una sola vez)
document.getElementById("form-nombre").addEventListener("submit", guardarNombre);
document.getElementById("borrar").addEventListener("click", borrarDatos);
document.getElementById("jug-a").addEventListener("change", compararJugadores);
document.getElementById("jug-b").addEventListener("change", compararJugadores);
mostrarPagina();