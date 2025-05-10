package com.divipay.backend.entities.mongo;

import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "expenses")
public class ExpenseDocument {

    @Id
    private String id;
    private String payerId;
    private double total;
    private String concept;
    private String type;
    private List<Participation> participation;
    private ObjectId supportImageId;

    @Data
    public static class Participation {
        private String userId;
        private PaymentState state;  // Payment state now as an enum
        private double portion;
    }

    public enum PaymentState {
        NONE(0),               // No confirmation yet
        PAYER_CONFIRMED(1),    // Payer confirmed, but not the receiver
        RECEIVER_CONFIRMED(2), // Receiver confirmed, but not the payer
        BOTH_CONFIRMED(3);     // Both payer and receiver confirmed

        private final int value;

        PaymentState(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }

        // Converts an integer value to the corresponding PaymentState enum
        public static PaymentState fromValue(int value) {
            for (PaymentState state : values()) {
                if (state.value == value) {
                    return state;
                }
            }
            throw new IllegalArgumentException("Unexpected value: " + value);
        }
    }
}
