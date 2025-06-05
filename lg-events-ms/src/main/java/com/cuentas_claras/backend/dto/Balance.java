package com.cuentas_claras.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Balance {
    private String userId;
    private Double balance;
}
