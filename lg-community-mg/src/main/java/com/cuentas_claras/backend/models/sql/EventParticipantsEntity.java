package com.cuentas_claras.backend.models.sql;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;
import uk.co.jemos.podam.common.PodamExclude;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class EventParticipantsEntity extends BaseEntity {

    private String participantId;

    @PodamExclude
    @ManyToOne(fetch = FetchType.LAZY)
    private EventEntity event;


    
}
