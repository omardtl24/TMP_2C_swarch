package com.cuentas_claras.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;



@Data
@EqualsAndHashCode(callSuper = true)
public class EventDetailDTO extends EventDTO {
    private Long id;
    private String creatorId;
    private boolean invitationEnabled;
    private String invitationCode;
}