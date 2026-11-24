---
tags: [decisiones]
---
# Decisiones

## Hook automático en vez de skill o app
**2026-11-24** — Opciones: skill `/prompt`, hook automático, app de chat aparte. David eligió el hook automático: no hay que acordarse de invocarlo y funciona en todos los proyectos.

## Detección por reglas, sin llamar a un modelo
**2026-11-24** — El hook decide con reglas locales (≤15 palabras, una línea, verbo de acción, no pregunta). Es instantáneo y gratis. Los hooks `prompt` (con LLM) no están disponibles para UserPromptSubmit. Si da muchos falsos positivos, se revisa.

## El hook no reescribe el mensaje: añade instrucciones
**2026-11-24** — UserPromptSubmit no puede cambiar el texto del usuario, solo añadir contexto. Claude escribe el prompt desarrollado en un bloque corto visible y luego lo ejecuta.
