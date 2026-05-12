# bug-reporter · Skill v1.0

| Campo | Valor |
|---|---|
| **Identificador** | `bug-reporter` |
| **Invocada por** | `qa-agent` — Modo C |
| **Propósito** | Redactar bugs estructurados con Repro Steps, evidencia y severidad, listos para radicar en Azure DevOps |

---

## Inputs

| Campo | Requerido | Descripción |
|---|---|---|
| `origen` | Sí | `hu` / `ambiente` / `productivo` — determina el flujo de asignación |
| `hu_id` | Condicional | Requerido si `origen` es `hu` o `ambiente` con HU asociada |
| `modulo` | Sí | Módulo afectado tal como aparece en el work item |
| `descripcion` | Sí | Descripción corta del fallo observado |
| `repro_steps` | Sí | Pasos para reproducir el bug — puede venir del TC fallido |
| `resultado_esperado` | Sí | Qué debería ocurrir según los AC |
| `resultado_observado` | Sí | Qué ocurrió realmente |
| `evidencia` | Sí | Screenshots, logs, responses o videos del fallo |
| `ambiente` | Sí | `DEV` / `QA` / `Producción` |
| `asignado_a` | Condicional | Dev o Líder Técnico — determinado por la tabla de flujo controlado |

Si algún input requerido falta, la skill lo reporta al qa-agent y espera antes de continuar.

---

## Proceso

### 1. Determinar severidad

Evalúa el impacto del bug según este criterio:

| Severidad | Criterio |
|---|---|
| **Crítico** | Bloquea un flujo completo en producción, sin workaround posible |
| **Alto** | Afecta funcionalidad principal, existe workaround pero es difícil o costoso |
| **Medio** | Afecta funcionalidad secundaria o existe workaround fácil |
| **Bajo** | Error cosmético o de UX, no afecta funcionalidad |

Cuando hay duda entre dos niveles, asigna el más alto e indica al qa-agent que lo revise.

### 2. Determinar asignación

Aplica la tabla de flujo controlado del qa-agent:

| Origen | Asignación |
|---|---|
| Bug encontrado en HU (DEV o QA) | Directo al desarrollador de la HU |
| Bug en DEV/QA sin HU asociada | Dev responsable del módulo o Líder Técnico |
| Bug productivo (soporte, operaciones, cliente) | **Siempre vía Líder Técnico — nunca directo al dev** |

### 3. Redactar el bug

Estructura el bug con el siguiente formato:

```
Título: [MODULO] [descripción corta del fallo] — [ambiente]

Severidad: Crítico / Alto / Medio / Bajo
Ambiente: DEV / QA / Producción
HU relacionada: #[ID] (si aplica)
Módulo: [MODULO]

--- DESCRIPCIÓN ---
[Descripción clara del comportamiento incorrecto observado]

--- PASOS PARA REPRODUCIR ---
1. [Paso 1]
2. [Paso 2]
3. [Paso N]

--- RESULTADO ESPERADO ---
[Qué debería ocurrir según los AC o el comportamiento definido]

--- RESULTADO OBSERVADO ---
[Qué ocurrió realmente — incluir código de error, mensaje, respuesta HTTP si aplica]

--- EVIDENCIA ---
[Screenshots / logs / response body adjuntos]

--- INFORMACIÓN DEL SISTEMA ---
Ambiente: [DEV / QA / Producción]
Build / versión: [número de build o versión desplegada]
Fecha y hora: [timestamp de cuando se reprodujo]
```

### 4. Validar antes de radicar

Antes de publicar en Azure DevOps, presenta el bug redactado al qa-agent para confirmación. No radica sin aprobación explícita.

---

## Output

### Bug listo para radicar

```
bug-reporter: ✅ Bug redactado

Título: [MODULO] [descripción] — [ambiente]
Severidad: [nivel]
Asignado a: [dev / Líder Técnico]
HU relacionada: #[ID]

[Cuerpo completo del bug]

¿Confirmas la radicación en Azure DevOps?
```

### Si hay inputs insuficientes

```
bug-reporter: ⚠️ Inputs insuficientes para radicar el bug

Falta:
- resultado_esperado: ¿qué debería haber ocurrido según los AC?
- evidencia: adjunta screenshot o log del fallo

Proporciona los datos faltantes para continuar.
```

---

## Restricciones

- **NUNCA** radica un bug productivo asignado directamente al desarrollador
- **NUNCA** publica un bug sin evidencia adjunta
- **NUNCA** radica sin confirmación explícita del qa-agent
- **NUNCA** omite el resultado esperado vs. observado — es obligatorio en todos los bugs
- **NUNCA** asume la asignación si el origen no está claro — pregunta al qa-agent

---

*skill v1.0 — parte del ecosistema qa-agent · Equipo FLIT*