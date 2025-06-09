package com.cuentas_claras.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ExpenseDetailDTO extends ExpenseDTO {
    private Long event;
}