package com.cuentas_claras.backend.dto;

import lombok.Data;

@Data
public class NewParticipationInput {
    private String userId;
    private int state;
    private double portion;
}