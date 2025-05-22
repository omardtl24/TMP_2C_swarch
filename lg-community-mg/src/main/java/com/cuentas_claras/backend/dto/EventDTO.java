package com.cuentas_claras.backend.dto;

import lombok.Data;
import java.util.Date;

/**
 * DTO para creación y actualización de eventos.
 */
@Data
public class EventDTO {
    private Long id;
    private String name;
    private String description;
    private Date beginDate;
    private Date endDate;
}
