package com.cuentas_claras.backend.dto;
import java.util.Date;
import java.util.List;
import lombok.Data;

@Data
public class ExpenseCreatedEvent {
    private String expenseId;
    private double total;
    private String concept;
    private String type;
    private Date createdAt;
    private List<Participation> participation;

    @Data
    public static class Participation {
        private String userId;
        private double portion;
    }

}