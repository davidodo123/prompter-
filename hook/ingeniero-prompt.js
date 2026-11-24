#!/usr/bin/env node
// Ingeniero Prompt — hook UserPromptSubmit de Claude Code.
// Detecta peticiones cortas o vagas ("cambia el diseño") y le pide a Claude
// que primero las convierta en un prompt bien desarrollado y luego lo ejecute.
//
// Atajos:
//   ++ texto   fuerza la ampliación aunque el mensaje sea largo
//   !  texto   desactiva la ampliación para ese mensaje
//   /comando   nunca se amplía (slash commands)

const MAX_PALABRAS = 15;

// Verbos de acción (raíces) en español e inglés.
const VERBOS = [
  'cambi', 'arregl', 'mejor', 'haz', 'hagas', 'pon', 'quit', 'añad', 'anad', 'agreg',
  'cre', 'rediseñ', 'redisen', 'diseñ', 'disen', 'modific', 'actualiz', 'optimiz',
  'refactoriz', 'limpi', 'mueve', 'mov', 'elimin', 'borr', 'implement', 'sube',
  'despleg', 'despliega', 'monta', 'prepar', 'arranc', 'ajust', 'corrig', 'repar',
  'retoc', 'renueva', 'renov', 'organiz', 'ordena', 'traduc', 'escrib', 'redact',
  'genera', 'construy', 'constru', 'integr', 'conect', 'añade', 'adapt',
  'fix', 'change', 'improve', 'make', 'add', 'remove', 'redesign', 'refactor',
  'update', 'build', 'create', 'clean',
];

// Respuestas cortas que no son peticiones nuevas.
const RESPUESTAS = /^(s[ií]|no|ok|vale|dale|venga|perfecto|gracias|listo|hecho|sigue|contin[uú]a|adelante|eso|esa|ese|la \d+|el \d+|opci[oó]n \d+|\d+|[a-d])[\s.!,]*$/i;

function leerEntrada() {
  return new Promise((resolve) => {
    let datos = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (datos += c));
    process.stdin.on('end', () => resolve(datos));
    process.stdin.on('error', () => resolve(''));
  });
}

function normalizar(t) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function tieneVerbo(texto) {
  const palabras = normalizar(texto).split(/[^a-zñ]+/).filter(Boolean);
  const raices = VERBOS.map(normalizar);
  return palabras.some((p) => raices.some((r) => p.startsWith(r)));
}

function decidir(prompt) {
  const t = (prompt || '').trim();
  if (!t) return { ampliar: false };
  if (t.startsWith('/')) return { ampliar: false };
  if (t.startsWith('!')) return { ampliar: false };
  if (t.startsWith('++')) return { ampliar: true, texto: t.slice(2).trim(), forzado: true };
  if (RESPUESTAS.test(t)) return { ampliar: false };
  if (t.includes('\n')) return { ampliar: false }; // ya viene desarrollado
  if (t.startsWith('¿') || t.endsWith('?')) return { ampliar: false }; // pregunta, no encargo
  const n = t.split(/\s+/).length;
  if (n > MAX_PALABRAS) return { ampliar: false };
  if (!tieneVerbo(t)) return { ampliar: false };
  return { ampliar: true, texto: t, forzado: false };
}

function instrucciones(texto) {
  return [
    'INGENIERO PROMPT (hook): la petición del usuario es corta o vaga: «' + texto + '».',
    'Antes de actuar, conviértela en un prompt bien desarrollado. Pasos:',
    '1. Mira el contexto real primero (archivos relevantes del repo, diario/Roadmap.md si existe, lo hablado en esta conversación). No inventes.',
    '2. Escribe el prompt ampliado en un bloque corto titulado "🛠 Prompt desarrollado" con:',
    '   - Objetivo: qué se quiere conseguir y para quién.',
    '   - Contexto: proyecto, archivos o pantallas afectadas, estado actual.',
    '   - Alcance: qué se toca y qué NO se toca.',
    '   - Requisitos concretos: lista de cambios específicos y medibles (en diseño: tipografía, color, espaciado, jerarquía, responsive, estados, accesibilidad).',
    '   - Restricciones: mantener estilo y stack existentes, no romper funcionalidad.',
    '   - Hecho cuando: criterios comprobables.',
    '3. Si hay una ambigüedad que cambia el resultado de verdad, haz UNA pregunta con opciones; si no, asume lo razonable, dilo en una línea y ejecuta el prompt desarrollado.',
    'Mantén el bloque breve (máx. ~12 líneas). El usuario puede saltarse esto empezando el mensaje con "!".',
  ].join('\n');
}

module.exports = { decidir };

if (require.main === module) (async () => {
  try {
    const raw = await leerEntrada();
    const entrada = raw ? JSON.parse(raw) : {};
    const d = decidir(entrada.prompt);
    if (!d.ampliar) process.exit(0);
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext: instrucciones(d.texto),
        },
      })
    );
  } catch {
    // Nunca bloquear al usuario por un fallo del hook.
  }
  process.exit(0);
})();
