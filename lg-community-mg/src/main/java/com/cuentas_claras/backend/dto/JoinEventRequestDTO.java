package com.cuentas_claras.backend.dto;

import lombok.Data;

/**
 * DTO para solicitar unirse a un evento mediante código de invitación.
 */
@Data
public class JoinEventRequestDTO {
    private String invitationCode;
}
