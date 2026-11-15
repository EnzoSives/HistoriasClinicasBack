# Módulo de Turnos — Guía de uso

## Conceptos

- Un **médico** puede tener múltiples **franjas horarias** por día (ej. mañana y tarde), configuradas en `HorarioMedico`.
- Cada franja define el rango de atención, la duración de cada slot y el máximo de turnos permitidos en esa franja.
- Al crear un turno el backend valida automáticamente: que el horario caiga en una franja activa, que el slot esté alineado con la duración configurada, que el slot esté libre y que no se supere el límite diario.

---

## 1. Configurar horarios del médico

### Crear una franja horaria

```http
POST /horario-medico
Content-Type: application/json

{
  "id_medico": 3,
  "diaSemana": 1,
  "horaInicio": "08:00",
  "horaFin": "12:00",
  "duracionMinutos": 30,
  "maxTurnosPorDia": 8
}
```

**`diaSemana`**: `0` = domingo, `1` = lunes, `2` = martes, `3` = miércoles, `4` = jueves, `5` = viernes, `6` = sábado.

El mismo médico puede tener más de una franja en el mismo día (ej. mañana y tarde), siempre que los rangos no se solapen:

```json
{ "id_medico": 3, "diaSemana": 1, "horaInicio": "15:00", "horaFin": "18:00", "duracionMinutos": 30, "maxTurnosPorDia": 6 }
```

### Obtener franjas de un médico

```http
GET /horario-medico/medico/3
```

Respuesta:
```json
[
  { "id": 1, "id_medico": 3, "diaSemana": 1, "horaInicio": "08:00:00", "horaFin": "12:00:00", "duracionMinutos": 30, "maxTurnosPorDia": 8 },
  { "id": 2, "id_medico": 3, "diaSemana": 1, "horaInicio": "15:00:00", "horaFin": "18:00:00", "duracionMinutos": 30, "maxTurnosPorDia": 6 }
]
```

### Editar una franja

```http
PATCH /horario-medico/1
Content-Type: application/json

{
  "maxTurnosPorDia": 10
}
```

### Eliminar una franja

```http
DELETE /horario-medico/1
```

---

## 2. Generar slots disponibles (lógica frontend)

El backend no genera la grilla de slots; esa lógica vive en el frontend usando los datos de las franjas:

```js
function generarSlots(horaInicio, horaFin, duracionMinutos, fecha) {
  const slots = []
  const [hh, mm] = horaInicio.split(':').map(Number)
  const [hf, mf] = horaFin.split(':').map(Number)
  let actual = hh * 60 + mm
  const fin = hf * 60 + mf

  while (actual < fin) {
    const h = String(Math.floor(actual / 60)).padStart(2, '0')
    const m = String(actual % 60).padStart(2, '0')
    slots.push(new Date(`${fecha}T${h}:${m}:00`).toISOString())
    actual += duracionMinutos
  }
  return slots
}

// Ejemplo: slots del lunes 21/04/2026, franja 08:00-12:00, slots de 30 min
const slots = generarSlots("08:00", "12:00", 30, "2026-04-21")
// ["2026-04-21T11:00:00.000Z", "2026-04-21T11:30:00.000Z", ...]
// (el offset UTC depende de la zona horaria del entorno)
```

Para mostrar los slots ya ocupados, cruzar la lista generada con los turnos obtenidos de `GET /turno/medico/:id` filtrando por fecha y excluyendo los cancelados.

---

## 3. Crear un turno

```http
POST /turno
Content-Type: application/json

{
  "fechaHora": "2026-04-21T08:30:00.000Z",
  "id_paciente": 12,
  "id_medico": 3,
  "motivo": "Control anual",
  "notas": ""
}
```

**`fechaHora`** debe ser una fecha ISO 8601. El backend realiza las siguientes validaciones en orden:

1. El médico existe.
2. El paciente existe.
3. El día de la semana tiene al menos una franja configurada para ese médico.
4. El horario cae dentro de alguna de las franjas del día.
5. El horario está alineado con los slots de `duracionMinutos` de esa franja.
6. No se superó el total de `maxTurnosPorDia` sumado entre todas las franjas del día (excluyendo cancelados).
7. No existe ya un turno activo en ese mismo horario exacto.

Si alguna validación falla, la respuesta es `400 Bad Request` con un mensaje descriptivo.

---

## 4. Ver turnos de un médico

```http
GET /turno/medico/3
```

Devuelve todos los turnos ordenados por fecha, con los datos del paciente incluidos.

---

## 5. Cambiar el estado de un turno

```http
PATCH /turno/47
Content-Type: application/json

{
  "estado": "confirmado"
}
```

Estados posibles:

| Valor | Descripción |
|-------|-------------|
| `pendiente` | Estado inicial al crear el turno |
| `confirmado` | Turno confirmado por el médico o la secretaría |
| `cancelado` | Turno cancelado (no cuenta para el límite diario) |
| `completado` | Consulta realizada |

---

## 6. Eliminar un turno

```http
DELETE /turno/47
```

---

## Resumen de endpoints

| Método | URL | Acción |
|--------|-----|--------|
| `POST` | `/horario-medico` | Crear franja horaria |
| `GET` | `/horario-medico/medico/:id` | Ver franjas de un médico |
| `PATCH` | `/horario-medico/:id` | Editar franja |
| `DELETE` | `/horario-medico/:id` | Eliminar franja |
| `POST` | `/turno` | Crear turno |
| `GET` | `/turno/medico/:id` | Listar turnos de un médico |
| `PATCH` | `/turno/:id` | Actualizar estado u otros campos |
| `DELETE` | `/turno/:id` | Eliminar turno |
