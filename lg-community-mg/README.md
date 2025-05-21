# API REST & GraphQL Endpoints - lg-community-mg

Este documento describe los endpoints REST y GraphQL expuestos por los controladores del microservicio **lg-community-mg**.

---

## Autenticación

Todos los endpoints protegidos requieren el header:

```
Authorization: Bearer <jwt>
```

El JWT debe ser obtenido tras autenticación y enviado en cada request protegido.

---

## REST Endpoints

### DefaultController
- **GET /**
  - **Descripción:** Endpoint de bienvenida. Devuelve un mensaje de estado del API.
  - **Respuesta:**
    ```json
    { "status": "OK", "message": "REST API for cuentas claras lg-community-mg is running" }
    ```

---

### EventController (`/events`)
- **POST /events**
  - Crea un nuevo evento. Recibe un `EventDTO` en el body.
  - **Request JSON:**
    ```json
    {
      "name": "Viaje a la playa",
      "description": "Vacaciones con amigos",
      "beginDate": "2025-06-01T00:00:00.000Z",
      "endDate": "2025-06-07T00:00:00.000Z"
    }
    ```
  - **Response JSON:**
    ```json
    {
      "id": 1,
      "name": "Viaje a la playa",
      "description": "Vacaciones con amigos",
      "beginDate": "2025-06-01T00:00:00.000Z",
      "endDate": "2025-06-07T00:00:00.000Z"
    }
    ```
- **GET /events/me**
  - Lista todos los eventos creados por el usuario autenticado.
  - **Response JSON:**
    ```json
    [
      {
        "id": 1,
        "name": "Viaje a la playa",
        "description": "Vacaciones con amigos",
        "beginDate": "2025-06-01T00:00:00.000Z",
        "endDate": "2025-06-07T00:00:00.000Z",
        "creatorId": "user123",
        "invitationEnabled": true,
        "invitationCode": "ABC123"
      }
    ]
    ```
- **GET /events/{id}**
  - Obtiene un evento por su ID.
  - **Response JSON:** igual a EventDetailDTO arriba.
- **GET /events/search?q=nombre**
  - Busca eventos por nombre parcial.
- **GET /events/upcoming?from=YYYY-MM-DD**
  - Lista eventos futuros a partir de la fecha dada.
- **GET /events/between?start=YYYY-MM-DD&end=YYYY-MM-DD**
  - Busca eventos en un rango de fechas.
- **PATCH /events/{id}/invite?enabled=true|false**
  - Habilita o deshabilita invitaciones de un evento.
- **DELETE /events/{id}**
  - Elimina un evento por su ID.

---

### EventParticipantsController (`/events`)
- **POST /events/join**
  - El usuario autenticado se une a un evento por código de invitación.
  - **Request JSON:**
    ```json
    { "invitationCode": "ABC123" }
    ```
- **DELETE /events/{eventId}/participants/{participantId}**
  - Elimina un participante de un evento.
- **GET /events/{eventId}/participants**
  - Lista los participantes de un evento.
  - **Response JSON:**
    ```json
    [
      { "id": 1, "participantId": "user123" },
      { "id": 2, "participantId": "user456" }
    ]
    ```

---

## GraphQL Endpoints (ExpenseController)

- **Endpoint:** `/graphql` (POST)
- **Header:**
  ```
  Authorization: Bearer <jwt>
  ```
- **Operaciones principales:**
  - `expensesByEvent(eventId: Long): [ExpenseEntity]`
  - `expensesPaidByMe: [ExpenseDocument]`
  - `expensesParticipatedByMe: [ExpenseDocument]`
  - `searchExpensesByType(type: ExpenseType): [ExpenseDocument]`
  - `searchExpensesByConcept(keyword: String): [ExpenseDocument]`
  - `sumAllExpenses: Double`
  - `createExpense(input: NewExpenseInput, supportImage: MultipartFile): ExpenseEntity`
  - `updateExpense(input: UpdateExpenseInput, supportImage: MultipartFile): ExpenseDocument`
  - `deleteExpense(input: DeleteExpenseInput): Boolean`
  - `uploadSupportImage(eventId: String, expenseId: String, file: MultipartFile): String`

### Ejemplo de NewExpenseInput
```json
{
  "eventId": 1,
  "total": 100.0,
  "concept": "Cena grupal",
  "type": "COMIDA_Y_BEBIDA",
  "participation": [
    { "userId": "user123", "state": 1, "portion": 50.0 },
    { "userId": "user456", "state": 1, "portion": 50.0 }
  ]
}
```

### Ejemplo de ExpenseDocument (respuesta)
```json
{
  "id": "664c1f...",
  "payerId": "user123",
  "total": 100.0,
  "concept": "Cena grupal",
  "type": "COMIDA_Y_BEBIDA",
  "participation": [
    { "userId": "user123", "state": 1, "portion": 50.0 },
    { "userId": "user456", "state": 1, "portion": 50.0 }
  ],
  "supportImageId": null
}
```

---

## Notas
- Todos los endpoints protegidos requieren el header `Authorization: Bearer <jwt>`.
- Los modelos y DTOs pueden consultarse en el código fuente para detalles de los campos.
- El endpoint `/graphql` acepta queries y mutations según el esquema GraphQL definido.
