db = db.getSiblingDB('expenses_db');

db.createCollection("expenses", {
    validator: {
        $and: [
            { $jsonSchema: {
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
                        "maxLength": 255,
                        "description": "Short description of the expense"
                    },
                    "type": {
                        "bsonType": "int",
                        "enum": [0, 1, 2, 3, 4, 5, 6],
                        "description": "0: Food and Beverage, 1: Purchase, 2: Home, 3: Transport, 4: Entertainment, 5: Communication, 6: Finantial Expenses"
                    },
                    "participation": {
                        "bsonType": "array",
                        "items": {
                            "bsonType": "object",
                            "required": ["user_id", "state", "portion"],
                            "properties": {
                                "user_id": {
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
                    "support_image_id": {
                        "bsonType": "objectId",
                        "description": "Reference to the image in GridFS"
                    }
                }
            }},
            { $expr: {
                $let: {
                    vars: {
                        // convert the participation array to an array of portions
                        portions: { $map: {
                            input: "$participation",
                            as: "part",
                            in: "$$part.portion"
                        }}
                    },
                    in: {
                        $and: [
                            // check each portion is less than or equal to total
                            { $allElementsTrue: {
                                $map: {
                                    input: "$$portions",
                                    as: "p",
                                    in: { $lte: ["$$p", "$total"] }
                                }
                            }},
                            // check that sum of portions doesn't exceed total
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
        "payer_id": "1",
        "total": 95.75,
        "concept": "Dinner at Italian restaurant",
        "type": 0,
        "participation": [
          {
            "user_id": "1",
            "state": 1,
            "portion": 0.5
          },
          {
            "user_id": "2",
            "state": 0,
            "portion": 0.5
          }
        ],
        "support_image_id": ObjectId("609c1b3f5f1c00006e00234d")
      }
)

// immediately deleting the dummy document
db.expenses.deleteMany({})