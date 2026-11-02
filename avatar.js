/* BASKET ZONE — BZ AVATAR STUDIO 2D
   Editor de avatares SVG de medio cuerpo. Sin dependencias externas.
   Configuración local: localStorage (este navegador/dispositivo).
*/
(function () {
  "use strict";

  const DEFAULTS = {
    skinColor: "#C9875B", hairStyle: "taper", hairColor: "#211914",
    eyeColor: "#292B35", expression: "neutral", facialHair: "none",
    clothing: "jersey", clothingColor: "#F47721",
    accessory: "none", accessoryColor: "#F4F4F2"
  };

  const CATALOGS = {
    skinColor: [
      ["#F6D7BD","Porcelana"],["#E9B995","Clara"],["#D99A70","Media clara"],
      ["#C9875B","Media"],["#A96543","Media oscura"],["#75452F","Oscura"]
    ],
    hairStyle: [
      ["taper","Low taper"],["fade","Fade"],["buzz","Buzz cut"],["curly","Rizos"],
      ["afro","Afro"],["crop","Textured crop"],["middle","Raya al medio"],
      ["spiky","Spiky"],["braids","Trenzas"]
    ],
    hairColor: [
      ["#171411","Negro"],["#38251C","Castaño oscuro"],["#68452F","Castaño"],
      ["#A66A36","Castaño claro"],["#D2A45F","Rubio"],["#B84E32","Cobrizo"],
      ["#D8D8D8","Gris"]
    ],
    eyeColor: [
      ["#292B35","Oscuro"],["#5A3827","Marrón"],["#477C72","Verde"],
      ["#4C78A8","Azul"],["#9A7442","Avellana"]
    ],
    expression: [["neutral","Neutral"],["happy","Sonrisa"],["serious","Serio"],["surprised","Sorprendido"]],
    facialHair: [["none","Sin barba"],["stubble","Sombra"],["mustache","Bigote"],["beard","Barba"]],
    clothing: [["jersey","Camiseta jersey"],["tee","Camiseta"],["hoodie","Hoodie"],["jacket","Chaqueta"]],
    clothingColor: [
      ["#F47721","Naranja"],["#F4F4F2","Blanco"],["#24242A","Negro"],
      ["#2457A6","Azul"],["#B52F35","Rojo"],["#477B58","Verde"],
      ["#7546A8","Morado"]
    ],
    accessory: [["none","Ninguno"],["headband","Vincha"],["cap","Gorra"],["glasses","Lentes"],["chain","Cadena"]],
    accessoryColor: [
      ["#F4F4F2","Blanco"],["#F47721","Naranja"],["#24242A","Negro"],
      ["#2457A6","Azul"],["#B52F35","Rojo"],["#477B58","Verde"],["#7546A8","Morado"]
    ]
  };

  const STORAGE_KEY = "basketZoneAvatar";
  // Grupos que se eligen con círculos de color (el resto son botones de texto)
  const COLOR_GROUPS = ["skinColor", "hairColor", "eyeColor", "clothingColor", "accessoryColor"];
  let instance = null;
  let contadorSvg = 0;   // para que cada dibujo tenga identificadores únicos

  function safeConfig(config) {
    const result = Object.assign({}, DEFAULTS, config || {});
    Object.keys(CATALOGS).forEach(key => {
      if (!CATALOGS[key].some(item => item[0] === result[key])) result[key] = DEFAULTS[key];
    });
    return result;
  }

  // ---------- Colores auxiliares ----------
  function mezclar(hex, destino, t) {
    const a = parseInt(hex.slice(1), 16), b = parseInt(destino.slice(1), 16);
    const canales = [16, 8, 0].map(function (s) {
      const x = (a >> s) & 255, y = (b >> s) & 255;
      return Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
    });
    return "#" + canales.join("");
  }
  const oscurecer = (hex, t) => mezclar(hex, "#000000", t);
  const aclarar = (hex, t) => mezclar(hex, "#FFFFFF", t);
  function esClaro(hex) {
    const n = parseInt(hex.slice(1), 16);
    return (((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) / 255 > 0.62;
  }

  // ---------- Cabello: devuelve { back, front, defs } (capa de atrás, capa de adelante y definiciones SVG) ----------
  // Casi todo se dibuja en la mitad izquierda y se refleja con espejo(). Cada estilo es un "case".
  function hairLayers(style, hair, cap, uid) {
    const dark = oscurecer(hair, 0.35), mid = oscurecer(hair, 0.16), light = aclarar(hair, 0.32);
    const espejo = g => g + '<g transform="translate(240 0) scale(-1 1)">' + g + "</g>";
    const trazo = (d, color, w, op) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;
    const relleno = (d, f, op) => `<path d="${d}" fill="${f}"${op ? ` opacity="${op}"` : ""}/>`;
    const defs = `<linearGradient id="${uid}fv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hair}" stop-opacity=".95"/><stop offset=".55" stop-color="${hair}" stop-opacity=".45"/><stop offset="1" stop-color="${hair}" stop-opacity="0"/></linearGradient><pattern id="${uid}pt" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="${dark}" opacity=".6"/></pattern>`;
    const degradado = `url(#${uid}fv)`;
    const patilla = relleno("M71 90 C70 98 69 105 69 111 L73 109 C73 102 75 96 78 90Z", hair);   // patilla fina junto a la oreja
    // Parte alta del peinado corto (con la línea de nacimiento del cabello en la frente)
    const tope = (alto) => relleno(`M120 ${alto} C94 ${alto} 73 ${alto + 12} 71 70 C70 78 71 84 73 88 C77 80 83 75 92 71 C101 68 111 66 120 66Z`, hair) +
      trazo("M92 72 C101 68 111 66 120 66", dark, 1.6, 0.35);
    const mechas = trazo("M96 46 C90 54 88 62 90 70", dark, 1.5, 0.3) + trazo("M108 42 C102 52 100 60 101 68", dark, 1.5, 0.28) + trazo("M120 40 C118 50 118 58 118 66", dark, 1.5, 0.25) + trazo("M102 47 C108 43 114 42 120 42", light, 2.6, 0.22);
    let back = "", front = "";
    switch (style) {
      case "fade":   // degradado a piel: el cabello se desvanece hacia las orejas
        front = espejo(tope(30) + relleno("M73 86 C71 94 69 102 68 110 L74 111 C76 102 79 94 84 86Z", degradado) + mechas); break;
      case "buzz":   // rapado parejo
        front = espejo(relleno("M120 44 C94 44 72 56 70 78 C70 84 71 89 73 92 C77 84 83 77 92 73 C102 69 112 68 120 68Z", hair, 0.8) +
          relleno("M120 44 C94 44 72 56 70 78 C70 84 71 89 73 92 C77 84 83 77 92 73 C102 69 112 68 120 68Z", `url(#${uid}pt)`) + patilla); break;
      case "curly": {   // rizos pegados a la cabeza
        const rizos = [[92, 36, 14], [106, 30, 14], [78, 48, 13], [72, 64, 11], [86, 56, 13], [98, 48, 13], [96, 66, 8], [108, 63, 8], [72, 84, 8], [71, 96, 7]];
        const rizo = r => `<circle cx="${r[0]}" cy="${r[1]}" r="${r[2]}" fill="${hair}" stroke="${dark}" stroke-width=".9" stroke-opacity=".4"/>` + trazo(`M${r[0] - r[2] * 0.5} ${r[1] - r[2] * 0.1} a${r[2] * 0.5} ${r[2] * 0.5} 0 0 1 ${r[2] * 0.6} ${-r[2] * 0.4}`, light, 1.6, 0.35);
        front = espejo(relleno("M120 40 C94 38 72 50 70 76 C70 86 71 92 72 98 L88 80 C100 70 110 67 120 66Z", mid) + rizos.map(rizo).join("")) +
          rizo([120, 27, 15]) + rizo([120, 63, 8]); break; }
      case "afro": {   // volumen redondo; el borde se hace con círculos pequeños para dar textura
        let borde = "", textura = "";
        for (let i = 0; i < 24; i++) {
          const a = (i / 24) * Math.PI * 2;
          borde += `<circle cx="${(120 + 74 * Math.cos(a)).toFixed(1)}" cy="${(84 + 59 * Math.sin(a)).toFixed(1)}" r="10"/>`;
        }
        for (let i = 0; i < 26; i++) {
          const a = i * 2.4, rr = 0.25 + ((i * 37) % 10) / 14;
          const cx = 120 + 62 * rr * Math.cos(a), cy = 84 + 48 * rr * Math.sin(a);
          textura += trazo(`M${(cx - 5).toFixed(1)} ${cy.toFixed(1)} q5 -6 10 0`, i % 2 ? dark : light, 1.8, 0.28);
        }
        back = `<g fill="${hair}"><ellipse cx="120" cy="84" rx="74" ry="59"/>${borde}</g>` + textura;
        front = relleno("M67 100 C66 62 88 46 120 46 C152 46 174 62 173 100 C170 86 162 76 152 70 C138 63 102 63 88 70 C78 76 70 86 67 100Z", hair) +
          `<g fill="${hair}"><circle cx="92" cy="69" r="5"/><circle cx="104" cy="65" r="5"/><circle cx="120" cy="63" r="5"/><circle cx="136" cy="65" r="5"/><circle cx="148" cy="69" r="5"/></g>` + espejo(patilla); break; }
      case "crop":   // corte texturizado con flequillo irregular hacia adelante
        front = espejo(relleno("M120 34 C94 34 72 46 70 72 C69 78 71 85 73 90 C76 84 82 80 88 79 L92 90 L100 80 L106 90 L114 79 L120 88Z", hair) +
          trazo("M100 38 C96 52 94 68 96 84", dark, 1.6, 0.35) + trazo("M112 36 C110 52 110 66 112 82", dark, 1.6, 0.3) + trazo("M96 44 C106 38 116 37 124 38", light, 3.2, 0.4) +
          relleno("M73 86 C71 94 69 102 68 110 L74 111 C76 102 79 94 84 86Z", degradado) + patilla); break;
      case "middle": {   // raya al medio: el cabello cae a los lados y enmarca la cara
        const cortina = relleno("M120 34 C90 34 64 52 62 90 C61 102 60 112 55 125 C60 125 66 122 70 116 C74 108 78 98 84 88 C92 72 104 62 120 58Z", hair) +
          trazo("M120 40 C98 44 78 60 68 92 L60 120", dark, 1.8, 0.3) + trazo("M118 46 C102 52 86 66 76 98 L70 116", dark, 1.6, 0.25) + trazo("M100 42 C86 48 74 62 68 80", light, 2.6, 0.25);
        front = espejo(cortina) + trazo("M120 34 L120 58", dark, 2.2, 0.55); break; }
      case "spiky": {   // mechones de punta con gel
        const pua = (a, b, c, d, e, f) => relleno(`M${a} ${b} Q${(a + e) / 2 - 3} ${(b + f) / 2} ${e} ${f} Q${(c + e) / 2 + 3} ${(d + f) / 2} ${c} ${d}Z`, hair) + trazo(`M${a + 3} ${b - 4} Q${(a + e) / 2} ${(b + f) / 2} ${e} ${f + 3}`, light, 1.6, 0.4);
        front = espejo(pua(70, 72, 80, 56, 58, 42) + pua(78, 58, 92, 48, 74, 24) + pua(90, 50, 106, 42, 94, 14)) + pua(106, 44, 134, 44, 120, 8) + espejo(tope(36) + mechas); break; }
      case "braids": {   // trenzas pegadas (cornrows) arriba y trenzas largas colgando a los lados
        const trenza = (x0, y0, x1, y1) => {
          let g = "";
          for (let j = 0; j < 11; j++) {
            const t = j / 10;
            g += `<circle cx="${(x0 + (x1 - x0) * t + Math.sin(t * 3) * 1.5).toFixed(1)}" cy="${(y0 + (y1 - y0) * t).toFixed(1)}" r="${(5.4 - 1.8 * t).toFixed(1)}" fill="${hair}" stroke="${dark}" stroke-width=".9" stroke-opacity=".55"/>`;
          }
          return g;
        };
        back = espejo(trenza(68, 98, 62, 182) + trenza(60, 102, 52, 178) + trenza(76, 96, 72, 186));
        front = espejo(tope(34) + trazo("M90 70 C92 54 102 44 118 38 M100 68 C101 56 108 48 118 42 M110 67 C110 58 114 52 120 46", mid, 2.4, 0.9) +
          trazo("M90 70 C92 54 102 44 118 38 M100 68 C101 56 108 48 118 42 M110 67 C110 58 114 52 120 46", dark, 1, 0.7) + patilla); break; }
      default:   // "taper": corte degradado clásico, más largo arriba y corto a los lados
        front = espejo(tope(36) + relleno("M73 86 C71 94 69 102 68 110 L74 111 C76 102 79 94 84 86Z", degradado) + patilla + mechas);
    }
    if (cap) front = espejo(patilla);   // con gorra solo se ve la patilla
    return { back: back, front: front, defs: defs };
  }

  // ---------- Ropa: devuelve { dibujo } sobre el cuerpo ----------
  function clothesShape(type, color) {
    const tinta = esClaro(color) ? "#09090B" : "#F4F4F2";
    const sombra = `<path d="M148 196 C156 230 158 262 158 300 L206 300 C204 244 190 214 148 196Z" fill="#000" opacity=".12"/>`;
    if (type === "tee") {
      return `<path d="M100 192 C84 196 66 204 54 220 L32 262 L56 276 L70 252 L70 300 L170 300 L170 252 L184 276 L208 262 L186 220 C174 204 156 196 140 192 C136 212 104 212 100 192Z" fill="${color}"/>${sombra}<path d="M100 192 C104 212 136 212 140 192" fill="none" stroke="${oscurecer(color, 0.3)}" stroke-width="6" stroke-linecap="round"/>`;
    }
    if (type === "hoodie") {
      return `<path d="M20 300 C22 240 54 203 100 190 C104 210 136 210 140 190 C186 203 218 240 220 300Z" fill="${color}"/>${sombra}<path d="M90 192 C98 218 142 218 150 192" fill="none" stroke="${oscurecer(color, 0.22)}" stroke-width="11" stroke-linecap="round"/><path d="M108 212 L105 250 M132 212 L135 250" stroke="${tinta}" stroke-width="3" stroke-linecap="round" opacity=".85"/><path d="M72 300 L82 262 H158 L168 300" fill="none" stroke="${oscurecer(color, 0.3)}" stroke-width="3" opacity=".7"/>`;
    }
    if (type === "jacket") {
      return `<path d="M20 300 C22 240 54 203 100 190 C104 210 136 210 140 190 C186 203 218 240 220 300Z" fill="${color}"/>${sombra}<path d="M100 192 L96 208 C108 218 132 218 144 208 L140 192 C136 206 104 206 100 192Z" fill="${oscurecer(color, 0.28)}"/><path d="M120 212 V300" stroke="${tinta}" stroke-width="4"/><path d="M48 238 L42 300 M192 238 L198 300" stroke="${tinta}" stroke-width="5" opacity=".85"/><circle cx="120" cy="216" r="3.5" fill="${tinta}"/>`;
    }
    // "jersey": camiseta sin mangas de baloncesto
    return `<path d="M66 300 L68 224 C68 206 78 197 94 192 L100 192 C104 214 136 214 140 192 L146 192 C162 197 172 206 172 224 L174 300Z" fill="${color}"/>${`<path d="M148 200 C156 230 158 262 158 300 L174 300 L172 224 C172 210 162 200 148 194Z" fill="#000" opacity=".12"/>`}<path d="M94 192 C98 216 142 216 146 192" fill="none" stroke="${tinta}" stroke-width="5"/><path d="M68 226 C68 206 78 197 94 192 M172 226 C172 206 162 197 146 192" fill="none" stroke="${tinta}" stroke-width="5" stroke-linecap="round"/><path d="M68 286 H172" stroke="${tinta}" stroke-width="4" opacity=".7"/><text x="120" y="274" text-anchor="middle" font-family="Arial,sans-serif" font-size="32" font-weight="900" fill="${tinta}">BZ</text>`;
  }

  function create(config, size, vista) {
    const c = safeConfig(config), s = Number(size) || 300;
    const uid = "bz" + (++contadorSvg), cara = vista === "cara";
    const skin = c.skinColor, hair = c.hairColor, sombraPiel = oscurecer(skin, 0.22);
    const cap = c.accessory === "cap", acc = c.accessoryColor;
    const capas = hairLayers(c.hairStyle, hair, cap, uid);
    const ceja = oscurecer(hair, 0.18), x = c.expression;

    // Expresión: cejas, ojos y boca
    const cejas = {
      neutral:   ["M82 99 Q96 92 109 97", "M131 97 Q144 92 158 99"],
      happy:     ["M82 97 Q96 90 109 95", "M131 95 Q144 90 158 97"],
      serious:   ["M82 94 Q96 96 109 101", "M131 101 Q144 96 158 94"],
      surprised: ["M82 91 Q96 81 109 88", "M131 88 Q144 81 158 91"]
    }[x];
    const alto = x === "surprised" ? 8 : 6.2, iris = x === "surprised" ? 5.3 : 4.8;
    const ojo = cx => `<ellipse cx="${cx}" cy="112" rx="9.5" ry="${alto}" fill="#F7F7F5"/><circle cx="${cx}" cy="112" r="${iris}" fill="${c.eyeColor}"/><circle cx="${cx}" cy="112" r="2.3" fill="#0D0D10"/><circle cx="${cx + 1.6}" cy="110" r="1.2" fill="#fff"/><path d="M${cx - 10.5} ${111 - alto * 0.2} Q${cx} ${107 - alto} ${cx + 10.5} ${111 - alto * 0.2}" fill="none" stroke="${sombraPiel}" stroke-width="2.4" stroke-linecap="round"/>` +
      (x === "happy" ? `<ellipse cx="${cx}" cy="${112 + alto}" rx="11" ry="4.2" fill="${skin}"/>` : "");
    const boca = {
      neutral:   `<path d="M106 148 Q120 151 134 148" fill="none" stroke="#6E352F" stroke-width="2.8" stroke-linecap="round"/><path d="M111 150 Q120 156 129 150Z" fill="#B5524C" opacity=".5"/>`,
      happy:     `<path d="M102 144 Q120 166 138 144 Q120 152 102 144Z" fill="#F7F7F5" stroke="#6E352F" stroke-width="2.6" stroke-linejoin="round"/>`,
      serious:   `<path d="M107 150 L133 150" stroke="#6E352F" stroke-width="3" stroke-linecap="round"/>`,
      surprised: `<ellipse cx="120" cy="150" rx="6.5" ry="8.5" fill="#4A1F1C" stroke="#6E352F" stroke-width="2.4"/>`
    }[x];

    // Vello facial
    let facial = "";
    if (c.facialHair === "stubble") facial = `<path d="M70 112 C70 150 92 176 120 178 C148 176 170 150 170 112 C166 140 150 150 138 152 Q120 146 102 152 C90 150 74 140 70 112Z" fill="${hair}" opacity=".26"/>`;
    if (c.facialHair === "beard") facial = `<path d="M68 106 C68 152 90 180 120 182 C150 180 172 152 172 106 C170 138 154 156 138 158 Q120 150 102 158 C86 156 70 138 68 106Z" fill="${hair}"/>`;
    if (c.facialHair === "mustache" || c.facialHair === "beard") facial += `<path d="M100 142 Q110 135 120 141 Q130 135 140 142 Q130 148 120 145 Q110 148 100 142Z" fill="${hair}"/>`;

    // Accesorios
    let accesorio = "";
    if (c.accessory === "headband") accesorio = `<path d="M65 86 Q120 68 175 86" fill="none" stroke="${acc}" stroke-width="12" stroke-linecap="round"/><path d="M65 86 Q120 68 175 86" fill="none" stroke="${esClaro(acc) ? "#09090B" : "#F4F4F2"}" stroke-width="2" opacity=".4" transform="translate(0 -2)"/>`;
    if (cap) accesorio = `<path d="M64 78 C58 32 84 12 120 12 C156 12 182 32 176 78Z" fill="${acc}"/><path d="M120 14 V66 M96 18 C92 34 90 52 92 70 M144 18 C148 34 150 52 148 70" fill="none" stroke="${oscurecer(acc, 0.25)}" stroke-width="2" opacity=".6"/><circle cx="120" cy="13" r="3.6" fill="${oscurecer(acc, 0.25)}"/><path d="M62 76 Q120 90 178 76 L178 84 Q120 98 62 84Z" fill="${oscurecer(acc, 0.3)}"/><path d="M58 80 C84 90 156 90 182 80 C176 94 148 98 120 98 C92 98 64 94 58 80Z" fill="${oscurecer(acc, 0.12)}"/>`;
    if (c.accessory === "glasses") accesorio = `<g fill="rgba(255,255,255,.08)" stroke="#17171A" stroke-width="3.4"><rect x="80" y="100" width="32" height="25" rx="9"/><rect x="128" y="100" width="32" height="25" rx="9"/></g><path d="M112 109 Q120 105 128 109 M80 108 L68 104 M160 108 L172 104" fill="none" stroke="#17171A" stroke-width="3.4" stroke-linecap="round"/>`;
    let cadena = "";
    if (c.accessory === "chain") cadena = `<path d="M98 196 Q120 242 142 196" fill="none" stroke="#D9B65D" stroke-width="4.5"/><path d="M98 196 Q120 242 142 196" fill="none" stroke="#FFF3C4" stroke-width="1.2" stroke-dasharray="2 5" opacity=".7"/><path d="M120 228 l-8 10 8 11 8-11Z" fill="#D9B65D" stroke="#9C7A25" stroke-width="1.5"/>`;

    const cuerpo = `<path d="M24 300 C26 240 56 206 100 192 L140 192 C184 206 214 240 216 300Z" fill="${skin}"/><path d="M62 230 L66 300 M178 230 L174 300" stroke="${sombraPiel}" stroke-width="3" opacity=".5" fill="none"/>`;
    const cuello = `<path d="M101 150 L101 192 C108 202 132 202 139 192 L139 150Z" fill="${skin}"/><path d="M101 154 C106 178 134 178 139 154 L139 170 C132 184 108 184 101 170Z" fill="${sombraPiel}" opacity=".6"/>`;
    const cabeza = `<ellipse cx="66" cy="114" rx="9" ry="14" fill="${skin}"/><ellipse cx="174" cy="114" rx="9" ry="14" fill="${skin}"/><path d="M63 110 Q66 114 63 120 M177 110 Q174 114 177 120" fill="none" stroke="${sombraPiel}" stroke-width="2" opacity=".6"/><path d="M67 98 C67 62 90 46 120 46 C150 46 173 62 173 98 L173 112 C173 142 150 168 120 170 C90 168 67 142 67 112Z" fill="${skin}"/><path d="M173 100 C173 142 150 168 120 170 C142 158 162 140 166 108Z" fill="#000" opacity=".04"/><circle cx="86" cy="130" r="9" fill="#D9534F" opacity=".1"/><circle cx="154" cy="130" r="9" fill="#D9534F" opacity=".1"/>`;
    const rasgos = ojo(96) + ojo(144) + `<path d="${cejas[0]} ${cejas[1].replace("M", "M")}" fill="none" stroke="${ceja}" stroke-width="5" stroke-linecap="round"/><path d="M120 118 L117 132 Q120 137 126 133" fill="none" stroke="${sombraPiel}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${cara ? s : Math.round(s*1.25)}" viewBox="${cara ? "30 14 180 180" : "0 0 240 300"}" role="img" aria-label="${cara ? "Tu avatar" : "Avatar personalizado de medio cuerpo"}"><defs>${capas.defs}<linearGradient id="${uid}bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#24242A"/><stop offset="1" stop-color="#101014"/></linearGradient><clipPath id="${uid}clip"><rect x="0" y="0" width="240" height="300" rx="18"/></clipPath></defs><g clip-path="url(#${uid}clip)"><rect width="240" height="300" fill="url(#${uid}bg)"/><circle cx="120" cy="104" r="92" fill="#F47721" opacity=".1"/>${capas.back}${cuerpo}${cuello}${clothesShape(c.clothing, c.clothingColor)}${cadena}${cabeza}${facial}${rasgos}${boca}${capas.front}${accesorio}<path d="M0 288 H240" stroke="#F47721" stroke-opacity=".5" stroke-width="2"/></g></svg>`;
  }

  function download(filename, content, type) {
    const blob = new Blob([content], {type});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  const AvatarGenerator = {
    DEFAULTS, CATALOGS, create,
    // Avatar guardado en este navegador (o null si todavía no hay)
    getSaved() {
      try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? safeConfig(JSON.parse(raw)) : null; }
      catch (e) { return null; }
    },
    toDataURL(config, size) {
      return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(create(config,size));
    },
    downloadSVG(config, filename) { download(filename || "bz-avatar.svg", create(config,420), "image/svg+xml"); },
    downloadPNG(config, filename) {
      const svg = create(config,600), url = URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"}));
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas"); canvas.width = 600; canvas.height = 750;
        const ctx = canvas.getContext("2d"); ctx.drawImage(img,0,0,600,750);
        canvas.toBlob(blob => { const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=filename||"bz-avatar.png"; a.click(); URL.revokeObjectURL(a.href); URL.revokeObjectURL(url); },"image/png");
      };
      img.onerror = () => URL.revokeObjectURL(url);
      img.src = url;
    }
  };

  function optionMarkup(group, current) {
    return CATALOGS[group].map(([value,label]) => {
      if (COLOR_GROUPS.includes(group)) {
        return `<button type="button" class="bz-swatch ${current===value?"is-selected":""}" data-group="${group}" data-value="${value}" aria-pressed="${current===value}" style="--swatch:${value}" aria-label="${label}" title="${label}"></button>`;
      }
      return `<button type="button" class="bz-choice ${current===value?"is-selected":""}" data-group="${group}" data-value="${value}" aria-pressed="${current===value}">${label}</button>`;
    }).join("");
  }

  function render() {
    const c = instance.config;
    const groups = [
      ["skinColor","Tono de piel"],["hairStyle","Peinado"],["hairColor","Color de cabello"],
      ["eyeColor","Color de ojos"],["expression","Expresión"],["facialHair","Vello facial"],
      ["clothing","Prenda"],["clothingColor","Color de ropa"],["accessory","Accesorios"],["accessoryColor","Color del accesorio"]
    ];
    instance.container.innerHTML = `
      <div class="bz-avatar-studio">
        <div class="bz-avatar-stage">
          <div class="bz-stage-top"><span>BZ / AVATAR STUDIO</span><span>PREVIEW 2D</span></div>
          <div class="bz-avatar-art" id="bzAvatarPreview">${create(c,420)}</div>
          <p class="bz-avatar-caption">TU ESTILO. TU CANCHA.</p>
        </div>
        <div class="bz-avatar-controls">
          <div class="bz-editor-heading"><span class="etiqueta">PERSONALIZACIÓN</span><h2>Construye tu avatar</h2><p class="gris">Diseña tu identidad dentro de Basket Zone.</p></div>
          ${groups.map(([key,label])=>`<section class="bz-control-group" data-section="${key}"><h3>${label}</h3><div class="${COLOR_GROUPS.includes(key)?"bz-swatches":"bz-choices"}">${optionMarkup(key,c[key])}</div></section>`).join("")}
          <div class="bz-avatar-actions">
            <button type="button" class="boton" data-action="save">Guardar avatar</button>
            <button type="button" class="boton vacio" data-action="random">Aleatorio</button>
            <button type="button" class="boton vacio" data-action="reset">Restablecer</button>
          </div>
          <div class="bz-avatar-export"><button type="button" class="bz-export" data-action="png">Descargar PNG</button><button type="button" class="bz-export" data-action="svg">Descargar SVG</button></div>
          <p class="bz-avatar-status" id="bzAvatarStatus" role="status" aria-live="polite">Los cambios se guardan en este navegador cuando pulses «Guardar avatar».</p>
        </div>
      </div>`;
  }

  function update() {
    const preview = instance.container.querySelector("#bzAvatarPreview");
    if (preview) preview.innerHTML = create(instance.config,420);
    // El color del accesorio solo se muestra si la vincha o la gorra lo usan
    const colorAcc = instance.container.querySelector('[data-section="accessoryColor"]');
    if (colorAcc) colorAcc.hidden = !(instance.config.accessory === "headband" || instance.config.accessory === "cap");
    if (typeof instance.onChange === "function") instance.onChange(Object.assign({},instance.config));
  }

  function init(containerId, options) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    options = options || {};
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch(e) {}
    instance = {container, config:safeConfig(Object.assign({},saved,options.initialConfig||{})), onChange:options.onChange};
    render(); update();
    if (!container.__bzAvatarBound) {
      container.__bzAvatarBound = true;
      container.addEventListener("click", function (event) {
      const button = event.target.closest("button");
      if (!button || !container.contains(button)) return;
      if (button.dataset.group) {
        selectOption(button.dataset.group, button.dataset.value);
      } else if (button.dataset.action === "save") {
        try { localStorage.setItem(STORAGE_KEY,JSON.stringify(instance.config)); }
        catch(e) { setStatus("No se pudo guardar. Revisa el almacenamiento del navegador."); return; }
        setStatus("¡Avatar guardado! Ya aparece en tu perfil, en tus resultados y en Comunidad.");
        document.dispatchEvent(new CustomEvent("bz:avatar-saved",{detail:{config:Object.assign({},instance.config)}}));
      } else if (button.dataset.action === "random") {
        Object.keys(CATALOGS).forEach(key => { const list=CATALOGS[key]; instance.config[key]=list[Math.floor(Math.random()*list.length)][0]; });
        render(); update(); setStatus("Nueva combinación generada. Pulsa «Guardar avatar» para conservarla."); focusAction("random");
      } else if (button.dataset.action === "reset") {
        instance.config = Object.assign({},DEFAULTS); render(); update(); setStatus("Diseño restablecido. Pulsa Guardar avatar para conservarlo."); focusAction("reset");
      } else if (button.dataset.action === "svg") AvatarGenerator.downloadSVG(instance.config);
      else if (button.dataset.action === "png") AvatarGenerator.downloadPNG(instance.config);
      });
    }
    return {getConfig:()=>Object.assign({},instance.config), setConfig(next){instance.config=safeConfig(Object.assign({},instance.config,next));render();update();}};
  }

  // Cambia una opción sin redibujar todo el panel (así el foco del teclado no se pierde)
  function selectOption(group, value) {
    instance.config[group] = value;
    instance.container.querySelectorAll('[data-group="' + group + '"]').forEach(function (b) {
      const activo = b.dataset.value === value;
      b.classList.toggle("is-selected", activo);
      b.setAttribute("aria-pressed", activo);
    });
    update();
    setStatus("Tienes cambios sin guardar. Pulsa «Guardar avatar».");
  }

  function focusAction(action) {
    const b = instance.container.querySelector('[data-action="' + action + '"]');
    if (b) b.focus();
  }

  function setStatus(message) {
    const status=instance.container.querySelector("#bzAvatarStatus");
    if(status) status.textContent=message;
  }

  window.AvatarGenerator = AvatarGenerator;
  window.AvatarCreator = {init, getConfig:()=>instance?Object.assign({},instance.config):null, setConfig(next){if(!instance)return;instance.config=safeConfig(Object.assign({},instance.config,next));render();update();}, CATALOGS};
})();