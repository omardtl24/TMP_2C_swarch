# Relational Database Documentation

This document describes the relational structure of the database used in the project. The model is designed to manage users, events, and expenses in a collaborative context.

## 🧩 Entity-Relationship Diagram

The following ER diagram illustrates the relationships between the entities:

![ER Diagram](./ER_Data_Model.png)

> Generated with PlantUML

---

## 🗃️ Entities and Attributes

### 🧑 User

Represents a registered user in the system.

| Field      | Type   | Description           |
|------------|--------|-----------------------|
| `user_id`  | `int`  | Primary key           |
| `username` | `string` | Unique username     |
| `password` | `string` | Hashed password     |
| `name`     | `string` | Full name of the user |

---

### 📅 Event

Represents a scheduled or past event to which users are linked.

| Field        | Type   | Description              |
|--------------|--------|--------------------------|
| `event_id`   | `int`  | Primary key              |
| `begin_date` | `date` | Start date of the event  |
| `end_date`   | `date` | End date of the event    |
| `name`       | `string` | Name or title of the event |

---

### 💸 Expenses

Represents an expense made in the context of an event.

| Field             | Type     | Description                                |
|-------------------|----------|--------------------------------------------|
| `expense_id`      | `int`    | Primary key                                |
| `external_doc_id` | `string` | Reference to a document in the NoSQL store |

---

## 🔗 Relationships

- **User creates Event**  
  A user can create many events (`1:N`), but an event has only one creator.

- **User participates in Event**  
  A many-to-many relationship where multiple users can participate in multiple events.

- **Event has Expenses**  
  An event may have multiple related expenses (`1:N`), each tied to one event.

- **User creates Expenses**  
  A user can register multiple expenses; each expense is created by exactly one user.


---

## 🛠️ Notes

- Passwords must be stored securely using a cryptographic hash function.
- The `external_doc_id` in the `Expenses` table links to a document stored in a **NoSQL database** which has the expense details.
