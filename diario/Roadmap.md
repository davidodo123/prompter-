---
tags: [roadmap]
---
# Roadmap

Regla: se trabaja **una fase cada vez** y no se pasa a la siguiente hasta que David la comprueba.

Leyenda: `[x]` hecho · `[ ]` pendiente · `[/]` empezado · `[-]` descartado

## Fase 1 · Necesario
- [x] Elegir formato: hook automático → [[Decisiones#Hook automático en vez de skill o app]]
- [x] Script `hook/ingeniero-prompt.js` que detecta peticiones cortas/vagas
- [x] Atajos `++` (forzar) y `!` (saltar); ignora preguntas, respuestas cortas y slash commands
- [x] Instalar el hook global en `~/.claude/settings.json`
- [ ] David lo prueba en uso real (reiniciar Claude Code o abrir `/hooks`)
- [ ] Crear repo público `davidodo123/prompter` y subirlo

## Fase 2 · Importante
- [ ] Ajustar la detección con lo que falle en uso real (falsos positivos/negativos)
- [ ] Plantillas por tipo de petición (diseño, bug, feature, contenido)
- [ ] Registro local de prompts ampliados para revisar cuáles funcionaron

## Fase 3 · Extra
- [ ] Skill `/prompt` para ampliar a mano sin ejecutar
- [ ] Modo "solo enseñar" (amplía y espera confirmación antes de ejecutar)
