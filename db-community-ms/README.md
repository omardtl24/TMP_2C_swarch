# 📦 MongoDB Documentation – `expenses` Collection

This document describes the NoSQL data model for storing shared expense data using MongoDB. Images (e.g., scanned receipts) are stored using GridFS.

## 📂 Collection: `expenses`

Each document in the `expenses` collection represents a detailed expense or shared expense. It includes metadata, breakdown of participant shares, and a reference to an image in GridFS.

### 🧾 Example Document

```json
{
  "_id": "abc123",
  "payer_id": 1,
  "total": 95.75,
  "concept": "Dinner at Italian restaurant",
  "type": 0,
  "participation": [
    {
      "user_id": 1,
      "state": 3,
      "portion": 0.5
    },
    {
      "user_id": 2,
      "state": 0,
      "portion": 0.5
    }
  ],
  "support_image_id": { "$oid": "609c1b3f5f1c00006e00234d" }
}
```

### 🧩 Field Descriptions

| Field               | Type              | Description                                                             |
|--------------------|-------------------|-------------------------------------------------------------------------|
| `_id`              | ObjectId/String   | Unique ID of the expense (can match `external_doc_id` from SQL)           |
| `payer_id`         | String            | ID of the user who paid the expense (linked to SQL user_id)               |
| `total`            | Double            | Total amount of the expense                                               |
| `concept`          | String            | Short description of the expense                                          |
| `type`             | Int               | Category (see below)                                       |
| `participation`    | Array\<Object\>     | List of users involved and their payment confirmation                  |
| `support_image_id` | ObjectId          | Reference to image in GridFS (`fs.files._id`)                          |

#### `type` Field Semantics

| Value | Meaning                                                                 |
|-------|-------------------------------------------------------------------------|
| `0`   | Food and Beverages                                                      |
| `1`   | Purchase                                                                |
| `2`   | Home                                                                    |
| `3`   | Transport                                                               |
| `4`   | Entertainment                                                           |
| `5`   | Communication                                                           |
| `6`   | Financial Expenses                                                      |

### 👥 Participation Subdocument

| Field     | Type    | Description                                                                 |
|----------|---------|-----------------------------------------------------------------------------|
| `user_id`| String  | User ID from relational DB (`user.user_id`)                                 |
| `state`  | Int     | Payment confirmation state (see below)                                      |
| `portion`| Double  | Portion of the total expense (0.0 to 1.0 or fixed value)                        |

#### 🔄 `state` Field Semantics

| Value | Meaning                                                                 |
|-------|-------------------------------------------------------------------------|
| `0`   | Payment not confirmed by either party                                   |
| `1`   | Payer confirmed the payment, but receiver has not                       |
| `2`   | Receiver confirmed the payment, but payer has not                       |

---

## 🛠 JSON Schema for Validation

This schema can be applied using `db.createCollection()` or `collMod` to enforce document structure:

```json
{
  "bsonType": "object",
  "required": ["payer_id", "total", "concept", "type", "participation", "support_image_id"],
  "properties": {
    "payer_id": {
      "bsonType": "string",
      "description": "ID of the user who actually paid the expense"
    },
    "total": {
      "bsonType": "double",
      "minimum": 0,
      "description": "Total amount of the expense"
    },
    "concept": {
      "bsonType": "string",
      "description": "Short description of the expense"
    },
    "type": {
      "enum": [0, 1, 2, 3, 4, 5, 6],
      "description": "0: Food and Beverage, 1: Purchase, 2: Home, 3: Transport, 4: Entertainment, 5: Communication, 6: Finantial Expenses"
    },
    "participation": {
      "bsonType": "array",
      "items": {
        "bsonType": "object",
        "required": ["user_id", "state", "portion"],
        "properties": {
          "user_id": { "bsonType": "string" },
          "state": {
            "bsonType": "int",
            "enum": [0, 1, 2],
            "description": "0: None confirmed, 1: Payer confirmed, 2: Receiver confirmed, 3: Both confirmed"
          },
          "portion": { "bsonType": "double", "minimum": 0 }
        }
      }
    },
    "support_image_id": {
      "bsonType": "objectId",
      "description": "Reference to the image in GridFS"
    }
  }
}
```

---

## 🛠️ Notes

- `payer_id` and `user_id` refer to users stored in the relational Data Base.
- SQL-to-Mongo relationships are maintained using external keys (e.g., `external_doc_id` for matching `expenses._id`).
