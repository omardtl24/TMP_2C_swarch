package com.divipay.backend.models.sql;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;

import lombok.Data;
import lombok.EqualsAndHashCode;
import uk.co.jemos.podam.common.PodamExclude;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class PersonalExpenseEntity extends BaseEntity {

    private String concept;
    private String type;
    private Float total;

    @PodamExclude
    @ManyToOne(fetch = FetchType.LAZY)
    private UserEntity owner;
}