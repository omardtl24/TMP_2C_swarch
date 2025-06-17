package com.cuentas_claras.backend.dto;

import lombok.Data;

/**
 * DTO para representar un participante de evento.
 */
@Data
public class ParticipantDetailDTO {
    private Long id;
    private String participantId;
}