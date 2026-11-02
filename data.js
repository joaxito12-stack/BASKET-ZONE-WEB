/* ==========================================================
   DATOS DE LA WEB  (aquí editas lecciones, preguntas y datos de demostración)
   Los TEXTOS de cada página están en index.html.
   Orden: 3. Lecciones  4. Retos (preguntas, categorías, modos, niveles, insignias)  5. Datos de demostración
   ========================================================== */

/* ---------- 3. LECCIONES ----------
   Para añadir una, copia un bloque { ... } con un id nuevo y sin repetir.
   nivel: "Principiante", "Intermedio" o "Avanzado". "errores" es opcional. */
var LECCIONES = [
  { id: "reglas", titulo: "Reglas básicas", nivel: "Principiante",
    texto: "Dos equipos de cinco jugadores buscan meter el balón en el aro rival. Un tiro libre vale 1 punto, un tiro normal 2 y uno detrás de la línea de tres 3. El aro está a 3,05 metros del suelo.",
    consejo: "Aprende primero las violaciones: son las que más se pitan en partidos amateur.",
    errores: "Caminar con el balón sin botar (pasos) o botar de nuevo tras detener el bote (doble)." },
  { id: "posiciones", titulo: "Posiciones y funciones", nivel: "Principiante",
    texto: "Las cinco posiciones tradicionales son base, escolta, alero, ala-pívot y pívot. Cada una tiene una función, pero hoy los jugadores suelen combinar varias.",
    consejo: "Prueba varias posiciones al entrenar: entender el rol de cada una mejora tu lectura del juego.",
    errores: "Pensar que una posición solo sirve para una cosa, por ejemplo que los altos no pueden pasar." },
  { id: "bote", titulo: "Bote y control del balón", nivel: "Principiante",
    texto: "Bota con las yemas de los dedos, no con la palma. Mantén la cabeza arriba, las rodillas flexionadas y protege el balón con el cuerpo y la mano más alejada del defensor.",
    consejo: "Practica 5 minutos al día con cada mano, empezando despacio, y calienta antes.",
    errores: "Mirar siempre el balón y botar demasiado alto." },
  { id: "pases", titulo: "Pases", nivel: "Principiante",
    texto: "Los pases básicos son el de pecho, el picado y el de béisbol. Da el pase con las dos manos, extiende los brazos y termina con los pulgares hacia abajo.",
    consejo: "Pasa al espacio donde estará tu compañero, no donde está ahora.",
    errores: "Pasar sin mirar a la defensa o con demasiada fuerza." },
  { id: "tiro", titulo: "Fundamentos del lanzamiento", nivel: "Intermedio",
    texto: "Regla BEEF: equilibrio (Balance), ojos al aro (Eyes), codo bajo el balón (Elbow) y seguimiento del gesto (Follow-through). Las piernas dan la fuerza; los brazos, la dirección.",
    consejo: "Empieza cerca del aro y aumenta la distancia poco a poco. Si sientes molestias en hombro o muñeca, consulta a un entrenador.",
    errores: "Abrir el codo hacia afuera y tirar sin usar las piernas." },
  { id: "defensa", titulo: "Defensa individual", nivel: "Intermedio",
    texto: "Mantén las rodillas flexionadas, la espalda recta y los brazos activos. Desplázate con pasos laterales sin cruzar los pies y colócate entre tu rival y el aro.",
    consejo: "Mira el pecho del atacante: es lo que menos engaña, a diferencia de sus manos o la cabeza.",
    errores: "Saltar al primer amago y quedar fuera de posición." },
  { id: "sinbalon", titulo: "Movimiento sin balón", nivel: "Avanzado",
    texto: "Sin balón se crea espacio con cortes al aro, pantallas y cambios de ritmo. Un buen movimiento obliga al defensor a decidir y deja una opción de pase libre.",
    consejo: "Muévete con un propósito: corta, ocupa un espacio libre o bloquea para un compañero.",
    errores: "Quedarse parado esperando el pase." },
  { id: "fisica", titulo: "Preparación física y seguridad", nivel: "Avanzado",
    texto: "El baloncesto exige carrera, saltos y cambios de dirección. Combina trabajo de resistencia, fuerza de piernas y core, movilidad y descanso. Prioriza la técnica antes que la carga.",
    consejo: "Calienta 10 minutos antes y estira al terminar. Hidrátate y adapta el esfuerzo a tu nivel, con supervisión si eres principiante.",
    errores: "Aumentar la intensidad demasiado rápido o entrenar con dolor." }
];

/* ---------- 4. PREGUNTAS DEL RETO ----------
   Cada pregunta tiene:
     categoria   -> una de las "id" de CATEGORIAS (más abajo)
     dificultad  -> "facil", "medio" o "dificil" (da más o menos puntos)
     pregunta    -> el texto
     opciones    -> las respuestas posibles (para verdadero o falso: ["Verdadero", "Falso"])
     correcta    -> posición de la respuesta correcta (0 = primera, 1 = segunda...)
     explicacion -> se muestra después de responder
   Para añadir una pregunta: copia un bloque { ... } (no olvides la coma). */
var PREGUNTAS = [
  { categoria: "reglas", dificultad: "facil",
    pregunta: "¿Cuántos jugadores de un mismo equipo están en cancha a la vez?",
    opciones: ["4", "5", "6", "7"], correcta: 1,
    explicacion: "Cada equipo juega con cinco jugadores en cancha." },
  { categoria: "reglas", dificultad: "facil",
    pregunta: "¿Cuántos puntos vale un tiro libre?",
    opciones: ["1", "2", "3", "4"], correcta: 0,
    explicacion: "Cada tiro libre convertido suma 1 punto." },
  { categoria: "reglas", dificultad: "facil",
    pregunta: "¿Cuántos puntos vale un tiro detrás de la línea de tres puntos?",
    opciones: ["1", "2", "3", "4"], correcta: 2,
    explicacion: "El triple vale 3 puntos." },
  { categoria: "reglas", dificultad: "facil",
    pregunta: "¿A qué altura está el aro?",
    opciones: ["2,80 m", "3,05 m", "3,30 m", "3,50 m"], correcta: 1,
    explicacion: "El aro está a 3,05 metros (10 pies) del suelo." },
  { categoria: "reglas", dificultad: "facil",
    pregunta: "¿Qué violación se comete al botar de nuevo tras haber detenido el bote?",
    opciones: ["Pasos", "Doble", "Campo atrás", "Falta técnica"], correcta: 1,
    explicacion: "Se llama doble o dobles." },
  { categoria: "reglas", dificultad: "facil",
    pregunta: "Un equipo puede tener seis jugadores en cancha al mismo tiempo.",
    opciones: ["Verdadero", "Falso"], correcta: 1,
    explicacion: "Falso: son cinco por equipo." },
  { categoria: "reglas", dificultad: "facil",
    pregunta: "Caminar con el balón sin botarlo es una violación llamada pasos.",
    opciones: ["Verdadero", "Falso"], correcta: 0,
    explicacion: "Verdadero: los pasos se pitan al dar más pasos de los permitidos sin botar." },
  { categoria: "reglas", dificultad: "medio",
    pregunta: "¿Qué es un triple-doble?",
    opciones: ["Tres triples seguidos", "Dos dígitos en tres categorías estadísticas", "Tres tapones", "Tres faltas"], correcta: 1,
    explicacion: "Por ejemplo: 10 o más puntos, rebotes y asistencias en un mismo partido." },
  { categoria: "reglas", dificultad: "medio",
    pregunta: "Los tiros libres se lanzan desde detrás de la línea de tres puntos.",
    opciones: ["Verdadero", "Falso"], correcta: 1,
    explicacion: "Falso: se lanzan desde la línea de tiro libre, mucho más cerca del aro." },
  { categoria: "reglas", dificultad: "medio",
    pregunta: "¿Cuánto mide una cancha de baloncesto FIBA?",
    opciones: ["20 x 10 m", "24 x 12 m", "28 x 15 m", "32 x 18 m"], correcta: 2,
    explicacion: "La cancha FIBA mide 28 por 15 metros." },
  { categoria: "reglas", dificultad: "medio",
    pregunta: "¿Cuál es el diámetro interior aproximado del aro?",
    opciones: ["30 cm", "45 cm", "60 cm", "75 cm"], correcta: 1,
    explicacion: "Unos 45 centímetros." },
  { categoria: "reglas", dificultad: "medio",
    pregunta: "¿Qué ocurre cuando el balón sale de los límites del campo?",
    opciones: ["Se repite el salto inicial", "Saca el equipo contrario al que lo tocó por último", "Saca el mismo equipo", "Se pita falta técnica"], correcta: 1,
    explicacion: "La posesión es para el equipo contrario al último que tocó el balón." },
  { categoria: "historia", dificultad: "facil",
    pregunta: "¿Quién inventó el baloncesto en 1891?",
    opciones: ["James Naismith", "Michael Jordan", "Dean Smith", "Phil Jackson"], correcta: 0,
    explicacion: "James Naismith creó el juego en Springfield, Massachusetts." },
  { categoria: "historia", dificultad: "medio",
    pregunta: "¿Qué se usó como aros en los primeros partidos?",
    opciones: ["Cestas de duraznos", "Llantas", "Cubos de metal", "Aros de madera"], correcta: 0,
    explicacion: "Se colgaron cestas de duraznos del borde de un balcón." },
  { categoria: "historia", dificultad: "medio",
    pregunta: "¿En qué Juegos Olímpicos debutó el baloncesto masculino?",
    opciones: ["París 1924", "Berlín 1936", "Londres 1948", "Roma 1960"], correcta: 1,
    explicacion: "Debutó en Berlín 1936." },
  { categoria: "historia", dificultad: "medio",
    pregunta: "¿Qué liga nació en 1949 al fusionarse la BAA y la NBL?",
    opciones: ["WNBA", "EuroLeague", "NBA", "NCAA"], correcta: 2,
    explicacion: "Nació la NBA." },
  { categoria: "historia", dificultad: "dificil",
    pregunta: "¿En qué año se fundó la FIBA?",
    opciones: ["1904", "1932", "1946", "1960"], correcta: 1,
    explicacion: "La federación internacional se fundó en 1932." },
  { categoria: "historia", dificultad: "dificil",
    pregunta: "¿En qué año adoptó la NBA la línea de tres puntos?",
    opciones: ["1954", "1967", "1979", "1992"], correcta: 2,
    explicacion: "Fue en 1979." },
  { categoria: "historia", dificultad: "dificil",
    pregunta: "¿Qué introdujo la NBA en 1954?",
    opciones: ["Línea de tres puntos", "Reloj de 24 segundos", "Tiempo muerto", "Cuarto periodo"], correcta: 1,
    explicacion: "El reloj de 24 segundos aceleró el juego." },
  { categoria: "historia", dificultad: "dificil",
    pregunta: "El baloncesto femenino debutó en los Juegos Olímpicos de Montreal 1976.",
    opciones: ["Verdadero", "Falso"], correcta: 0,
    explicacion: "Verdadero." },
  { categoria: "historia", dificultad: "dificil",
    pregunta: "James Naismith nació en Canadá.",
    opciones: ["Verdadero", "Falso"], correcta: 0,
    explicacion: "Verdadero: nació en Almonte, Ontario." },
  { categoria: "historia", dificultad: "dificil",
    pregunta: "¿En qué Juegos Olímpicos jugó por primera vez el Dream Team?",
    opciones: ["Los Ángeles 1984", "Seúl 1988", "Barcelona 1992", "Atlanta 1996"], correcta: 2,
    explicacion: "Barcelona 1992, los primeros Juegos con jugadores de la NBA." },
  { categoria: "historia", dificultad: "dificil",
    pregunta: "¿En qué año comenzó la primera temporada de la WNBA?",
    opciones: ["1986", "1997", "2005", "2010"], correcta: 1,
    explicacion: "La WNBA empezó a jugar en 1997." },
  { categoria: "posiciones", dificultad: "facil",
    pregunta: "¿Qué posición suele dirigir el ataque del equipo?",
    opciones: ["Pívot", "Alero", "Base", "Ala-pívot"], correcta: 2,
    explicacion: "El base lleva el balón y organiza el juego." },
  { categoria: "posiciones", dificultad: "facil",
    pregunta: "¿Cuántas posiciones tradicionales hay en el baloncesto?",
    opciones: ["3", "4", "5", "6"], correcta: 2,
    explicacion: "Base, escolta, alero, ala-pívot y pívot." },
  { categoria: "posiciones", dificultad: "facil",
    pregunta: "¿Qué posición suele jugar más cerca del aro?",
    opciones: ["Base", "Escolta", "Alero", "Pívot"], correcta: 3,
    explicacion: "El pívot juega cerca del aro: rebotes, tapones y anotación interior." },
  { categoria: "posiciones", dificultad: "medio",
    pregunta: "¿Qué se espera principalmente de un escolta?",
    opciones: ["Anotar desde el perímetro", "Poner bloqueos bajo el aro", "Sacar siempre el balón", "Solo defender"], correcta: 0,
    explicacion: "El escolta suele anotar desde el perímetro." },
  { categoria: "posiciones", dificultad: "medio",
    pregunta: "En el baloncesto moderno las posiciones son completamente rígidas.",
    opciones: ["Verdadero", "Falso"], correcta: 1,
    explicacion: "Falso: muchos jugadores cumplen varias funciones." },
  { categoria: "fibanba", dificultad: "facil",
    pregunta: "¿Cuántos minutos dura un periodo en la NBA?",
    opciones: ["10", "12", "15", "20"], correcta: 1,
    explicacion: "La NBA juega 4 periodos de 12 minutos." },
  { categoria: "fibanba", dificultad: "facil",
    pregunta: "La WNBA es una liga profesional femenina de Estados Unidos.",
    opciones: ["Verdadero", "Falso"], correcta: 0,
    explicacion: "Verdadero." },
  { categoria: "fibanba", dificultad: "facil",
    pregunta: "¿Qué organismo gobierna el baloncesto a nivel internacional?",
    opciones: ["FIFA", "FIBA", "UEFA", "NCAA"], correcta: 1,
    explicacion: "La FIBA organiza el baloncesto internacional." },
  { categoria: "fibanba", dificultad: "medio",
    pregunta: "¿Qué línea de tres puntos está más lejos del aro?",
    opciones: ["La de FIBA", "La de la NBA", "Es igual", "Depende del equipo"], correcta: 1,
    explicacion: "La de la NBA: 7,24 m frente a 6,75 m en FIBA." },
  { categoria: "fibanba", dificultad: "medio",
    pregunta: "En la NBA un jugador sale del partido al cometer su sexta falta personal.",
    opciones: ["Verdadero", "Falso"], correcta: 0,
    explicacion: "Verdadero: en la NBA son 6 faltas; en FIBA, 5." },
  { categoria: "fibanba", dificultad: "medio",
    pregunta: "¿Cuántos equipos tiene la NBA?",
    opciones: ["24", "30", "32", "36"], correcta: 1,
    explicacion: "La NBA tiene 30 equipos." },
  { categoria: "fibanba", dificultad: "dificil",
    pregunta: "En reglas FIBA, ¿de cuántos segundos dispone un equipo para lanzar?",
    opciones: ["14", "20", "24", "30"], correcta: 2,
    explicacion: "La posesión dura 24 segundos." },
  { categoria: "fibanba", dificultad: "dificil",
    pregunta: "En FIBA, ¿cuántos periodos tiene un partido y cuánto dura cada uno?",
    opciones: ["2 de 20 min", "4 de 10 min", "4 de 12 min", "3 de 15 min"], correcta: 1,
    explicacion: "FIBA juega 4 periodos de 10 minutos; la NBA usa 12." },
  { categoria: "fibanba", dificultad: "dificil",
    pregunta: "En FIBA, ¿con cuántas faltas personales sale un jugador del partido?",
    opciones: ["4", "5", "6", "7"], correcta: 1,
    explicacion: "En FIBA son 5 faltas; en la NBA son 6." },
  { categoria: "fundamentos", dificultad: "facil",
    pregunta: "¿Con qué parte de la mano se bota el balón?",
    opciones: ["La palma", "Las yemas de los dedos", "Los nudillos", "La muñeca"], correcta: 1,
    explicacion: "Se bota con las yemas de los dedos, no con la palma." },
  { categoria: "fundamentos", dificultad: "facil",
    pregunta: "¿Qué se recomienda hacer antes de entrenar?",
    opciones: ["Calentar", "Dormir", "Comer mucho", "Nada"], correcta: 0,
    explicacion: "Calentar prepara el cuerpo y ayuda a evitar lesiones." },
  { categoria: "fundamentos", dificultad: "facil",
    pregunta: "¿Qué pase se da con las dos manos desde el pecho?",
    opciones: ["Pase de pecho", "Pase de béisbol", "Pase picado", "Gancho"], correcta: 0,
    explicacion: "Es el pase de pecho." },
  { categoria: "fundamentos", dificultad: "medio",
    pregunta: "En la regla BEEF, ¿qué significa Follow-through?",
    opciones: ["Equilibrio", "Mirar al aro", "Seguimiento del gesto", "Codo bajo el balón"], correcta: 2,
    explicacion: "Es mantener el gesto de la muñeca y el brazo después del lanzamiento." },
  { categoria: "fundamentos", dificultad: "medio",
    pregunta: "En defensa individual conviene cruzar los pies al desplazarse lateralmente.",
    opciones: ["Verdadero", "Falso"], correcta: 1,
    explicacion: "Falso: se usan pasos laterales sin cruzar los pies." },
  { categoria: "fundamentos", dificultad: "medio",
    pregunta: "Sin balón, lo mejor es quedarse quieto esperando el pase.",
    opciones: ["Verdadero", "Falso"], correcta: 1,
    explicacion: "Falso: hay que cortar, ocupar espacios y bloquear." },
  { categoria: "fundamentos", dificultad: "dificil",
    pregunta: "En defensa, ¿qué parte del atacante conviene mirar para no caer en amagues?",
    opciones: ["Los ojos", "El pecho", "Las manos", "Los pies"], correcta: 1,
    explicacion: "El pecho cambia menos que las manos o la cabeza." }
];

/* ---------- 4.1 CATEGORÍAS: para filtrar las preguntas ---------- */
var CATEGORIAS = [
  { id: "reglas", nombre: "Reglas" },
  { id: "historia", nombre: "Historia" },
  { id: "posiciones", nombre: "Posiciones" },
  { id: "fibanba", nombre: "FIBA y NBA" },
  { id: "fundamentos", nombre: "Fundamentos" }
];

/* ---------- 4.2 PUNTOS según la dificultad de la pregunta ---------- */
var PUNTOS_POR_DIFICULTAD = { facil: 10, medio: 15, dificil: 20 };

/* ---------- 4.3 MODOS DE JUEGO ----------
   preguntas = cuántas preguntas tiene el reto
   tiempo    = segundos por pregunta (0 = sin límite)
   vidas     = fallos permitidos (0 = no hay límite de fallos)
   Para crear un modo nuevo, copia un bloque y cambia los números. */
var MODOS = [
  { id: "clasico", nombre: "Clásico", descripcion: "10 preguntas, 20 segundos cada una.", preguntas: 10, tiempo: 20, vidas: 0 },
  { id: "practica", nombre: "Práctica", descripcion: "10 preguntas sin límite de tiempo.", preguntas: 10, tiempo: 0, vidas: 0 },
  { id: "contrarreloj", nombre: "Contrarreloj", descripcion: "10 preguntas, solo 10 segundos cada una.", preguntas: 10, tiempo: 10, vidas: 0 },
  { id: "supervivencia", nombre: "Supervivencia", descripcion: "Juegas hasta fallar 3 veces.", preguntas: 100, tiempo: 20, vidas: 3 }
];

/* ---------- 4.4 NIVELES: según los puntos totales que acumulas ---------- */
var NIVELES = [
  { nombre: "Novato", puntos: 0 },
  { nombre: "Titular", puntos: 100 },
  { nombre: "Estrella", puntos: 300 },
  { nombre: "Leyenda", puntos: 700 }
];

/* ---------- 4.5 INSIGNIAS ----------
   requisito puede ser: "retos" (retos completados), "perfectos" (retos sin fallos),
   "puntosTotales", "mejor" (mejor puntuación en un reto) o "lecciones" (lecciones completadas).
   La insignia se consigue cuando ese número llega a "valor". simbolo = lo que se ve dentro. */
var INSIGNIAS = [
  { id: "primer", nombre: "Primer reto", descripcion: "Completa un reto.", requisito: "retos", valor: 1, simbolo: "1" },
  { id: "constante", nombre: "Retador constante", descripcion: "Completa 5 retos.", requisito: "retos", valor: 5, simbolo: "5" },
  { id: "perfecto", nombre: "Reto perfecto", descripcion: "Termina un reto sin fallar.", requisito: "perfectos", valor: 1, simbolo: "★" },
  { id: "mejor100", nombre: "Gran puntuación", descripcion: "Consigue 100 puntos en un reto.", requisito: "mejor", valor: 100, simbolo: "100" },
  { id: "puntos500", nombre: "Medio millar", descripcion: "Acumula 500 puntos.", requisito: "puntosTotales", valor: 500, simbolo: "500" },
  { id: "estudiante", nombre: "Estudiante", descripcion: "Completa 4 lecciones.", requisito: "lecciones", valor: 4, simbolo: "L" }
];


/* ==========================================================
   5. DATOS DE DEMOSTRACIÓN (Liga Demo: equipos y jugadores FICTICIOS)
   Para cambiarlos, edita los números. Los totales de los partidos se
   calculan solos sumando los cuartos.
   ========================================================== */
var TEMPORADA_DEMO = "Temporada Demo 2026-27";

/* Resultados: q = puntos por cuarto */
var RESULTADOS_DEMO = [
  { jornada: "Jornada 10", local: "Faros de Bahía", visitante: "Torres del Este", qLocal: [24, 22, 25, 21], qVisitante: [18, 23, 20, 20] },
  { jornada: "Jornada 10", local: "Cumbres del Sur", visitante: "Rayos del Valle", qLocal: [20, 25, 18, 22], qVisitante: [22, 19, 24, 23] },
  { jornada: "Jornada 10", local: "Delfines del Puerto", visitante: "Águilas del Páramo", qLocal: [19, 21, 17, 22], qVisitante: [16, 20, 22, 16] },
  { jornada: "Jornada 9", local: "Águilas del Páramo", visitante: "Faros de Bahía", qLocal: [15, 20, 18, 18], qVisitante: [22, 19, 21, 22] }
];

/* Tabla: g = ganados, p = perdidos, pf/pc = puntos a favor/en contra por partido */
var TABLA_DEMO = [
  { equipo: "Faros de Bahía", g: 8, p: 2, pf: 88.4, pc: 79.1 },
  { equipo: "Cumbres del Sur", g: 7, p: 3, pf: 85.2, pc: 80.8 },
  { equipo: "Rayos del Valle", g: 6, p: 4, pf: 84.0, pc: 83.2 },
  { equipo: "Torres del Este", g: 4, p: 6, pf: 81.5, pc: 84.0 },
  { equipo: "Delfines del Puerto", g: 3, p: 7, pf: 80.3, pc: 84.7 },
  { equipo: "Águilas del Páramo", g: 2, p: 8, pf: 77.9, pc: 85.5 }
];

var PROXIMOS_DEMO = [
  { cuando: "Sáb 31 oct 2026 · 19:00", local: "Rayos del Valle", visitante: "Faros de Bahía" },
  { cuando: "Dom 1 nov 2026 · 17:00", local: "Delfines del Puerto", visitante: "Cumbres del Sur" },
  { cuando: "Sáb 7 nov 2026 · 19:00", local: "Águilas del Páramo", visitante: "Torres del Este" }
];

/* Jugadores: estadísticas por partido (PJ = partidos jugados) */
var JUGADORES_DEMO = [
  { nombre: "Iker Valdés", equipo: "Faros de Bahía", pos: "Base", pj: 10, min: 33.8, pts: 24.6, reb: 4.1, ast: 8.3, stl: 1.9, blk: 0.3, fg: 46.2, tp: 38.5, ft: 87.1 },
  { nombre: "Mateo Sandoval", equipo: "Cumbres del Sur", pos: "Escolta", pj: 10, min: 32.1, pts: 21.8, reb: 4.7, ast: 3.9, stl: 1.4, blk: 0.4, fg: 44.8, tp: 39.9, ft: 84.3 },
  { nombre: "Joaquín Herrera", equipo: "Rayos del Valle", pos: "Alero", pj: 10, min: 31.5, pts: 18.9, reb: 7.2, ast: 4.6, stl: 1.1, blk: 0.8, fg: 47.5, tp: 35.2, ft: 78.6 },
  { nombre: "Santiago Ortega", equipo: "Torres del Este", pos: "Ala-pívot", pj: 9, min: 29.7, pts: 16.4, reb: 9.8, ast: 2.2, stl: 0.8, blk: 1.3, fg: 53.1, tp: 29.4, ft: 72.0 },
  { nombre: "Bruno Maldonado", equipo: "Faros de Bahía", pos: "Pívot", pj: 10, min: 28.9, pts: 13.7, reb: 11.9, ast: 1.6, stl: 0.6, blk: 2.4, fg: 61.3, tp: 14.3, ft: 64.8 },
  { nombre: "Dante Fuentes", equipo: "Delfines del Puerto", pos: "Escolta", pj: 10, min: 34.2, pts: 19.5, reb: 3.8, ast: 5.1, stl: 2.0, blk: 0.2, fg: 42.7, tp: 36.4, ft: 81.9 }
];

/* Estadísticas que se muestran: [campo, nombre, unidad] */
var ESTADISTICAS = [
  ["pts", "Puntos", ""], ["reb", "Rebotes", ""], ["ast", "Asistencias", ""],
  ["stl", "Robos", ""], ["blk", "Tapones", ""],
  ["fg", "Tiros de campo", "%"], ["tp", "Triples", "%"], ["ft", "Tiros libres", "%"]
];