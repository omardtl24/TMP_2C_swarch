package com.cuentas_claras.backend.dto;

import lombok.Data;

@Data
public class ExpenseDTO {
    private Long id;
    private String creatorId;
    private String externalDocId;
}