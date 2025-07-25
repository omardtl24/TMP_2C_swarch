db = db.getSiblingDB('expenses_db');

db.createCollection("expenses", {
    validator: {
        $and: [
            { $jsonSchema: {
                "bsonType": "object",
                "required": ["payerId", "total", "concept", "type", "participation"],
                "properties": {
                    "payerId": {
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
                        "maxLength": 255,
                        "description": "Short description of the expense"
                    },
                    "type": {
                        "bsonType": "string",
                        "enum": ["COMIDA_Y_BEBIDA", "COMPRAS", "HOGAR", "TRANSPORTE", "ENTRETENIMIENTO", "COMUNICACION", "GASTOS_FINANCIEROS"],
                        "description": "Expense type as string (enum name)"
                    },
                    "participation": {
                        "bsonType": "array",
                        "items": {
                            "bsonType": "object",
                            "required": ["userId", "state", "portion"],
                            "properties": {
                                "userId": {
                                    "bsonType": "string",
                                    "description": "ID of the user who participated in the expense"
                                },
                                "state": {
                                    "bsonType": "int",
                                    "enum": [0, 1, 2],
                                    "description": "0: None confirmed, 1: Payer confirmed, 2: Receiver confirmed"
                                },
                                "portion": {
                                    "bsonType": "double",
                                    "minimum": 0,
                                    "description": "Portion of the total expense"
                                }
                            }
                        }
                    },
                    // ...existing code...
                }
            }},
            { $expr: {
                $let: {
                    vars: {
                        portions: { $map: {
                            input: "$participation",
                            as: "part",
                            in: "$$part.portion"
                        }}
                    },
                    in: {
                        $and: [
                            { $allElementsTrue: {
                                $map: {
                                    input: "$$portions",
                                    as: "p",
                                    in: { $lte: ["$$p", "$total"] }
                                }
                            }},
                            { $lte: [{ $sum: "$$portions" }, "$total"] }
                        ]
                    }
                }
            }}
        ]
    }
})

// we must insert a document, otherwise the database won't be created
db.expenses.insertOne(
    {
        "_id": ObjectId("abc123abc123abc123abc123"),
        "payerId": "1",
        "total": 95.75,
        "concept": "Dinner at Italian restaurant",
        "type": "COMIDA_Y_BEBIDA",
        "participation": [
          {
            "userId": "1",
            "state": 1,
            "portion": 0.5
          },
          {
            "userId": "2",
            "state": 0,
            "portion": 0.5
          }
        ],
        "support_image_id": ObjectId("609c1b3f5f1c00006e00234d")
      }
)

// immediately deleting the dummy document
db.expenses.deleteMany({})