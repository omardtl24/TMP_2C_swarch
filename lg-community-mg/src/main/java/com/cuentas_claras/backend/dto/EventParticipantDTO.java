package com.cuentas_claras.backend.dto;

import lombok.Data;
/**
 * DTO genérico para eliminar o consultar participación por evento.
 */
@Data
public class EventParticipantDTO {
    private Long eventId;
    private String participantId;
}