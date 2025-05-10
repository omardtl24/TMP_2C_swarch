package com.divipay.backend.entities.sql;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
// import jakarta.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import uk.co.jemos.podam.common.PodamExclude;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class ExpenseEntity extends BaseEntity {

    private String externalDocId;

    @PodamExclude
    @OneToOne(optional = false)
    private UserEntity payer;

    @PodamExclude
    @OneToOne(optional = false)
    private EventEntity event;
}