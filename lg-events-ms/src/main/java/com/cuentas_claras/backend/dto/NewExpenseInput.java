package com.cuentas_claras.backend.dto;

import lombok.Data;

@Data
public class NewExpenseInput {
    private Long eventId;
    private String externalDocId;
}