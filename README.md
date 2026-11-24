# Ingeniero Prompt

Hook `UserPromptSubmit` para Claude Code. Cuando escribes una petición corta o vaga ("cambia el diseño", "mejora la home"), le pide a Claude que primero la convierta en un prompt bien desarrollado (objetivo, contexto, alcance, requisitos, restricciones, criterio de hecho) y luego lo ejecute.

## Cuándo salta

- Mensaje de 15 palabras o menos, en una línea, con un verbo de acción (cambia, arregla, mejora, pon, añade, crea, rediseña…).
- No salta con preguntas, respuestas cortas ("sí", "dale", "la 2") ni slash commands.

## Atajos

| Prefijo | Efecto |
|---|---|
| `++ texto` | Fuerza la ampliación aunque sea largo |
| `! texto`  | Desactiva la ampliación para ese mensaje |

## Instalación

En `~/.claude/settings.json`, dentro de `hooks.UserPromptSubmit`:

```json
{
  "hooks": [
    {
      "type": "command",
      "command": "\"C:\Program Files\nodejs\node.exe\" \"C:\Users\david\Desktop\prompter\hook\ingeniero-prompt.js\"",
      "timeout": 5
    }
  ]
}
```

## Probar

```bash
echo '{"prompt":"cambia el diseño"}' | node hook/ingeniero-prompt.js
```
