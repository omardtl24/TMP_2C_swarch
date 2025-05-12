package com.divipay.backend.models.sql;

import java.util.Date;

import com.divipay.backend.models.enums.ExpenseType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import uk.co.jemos.podam.common.PodamExclude;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class PersonalExpenseEntity extends BaseEntity {

    private String concept;

    @Enumerated(EnumType.STRING)
    private ExpenseType type;

    private Float total;

    @Temporal(TemporalType.DATE)
    private Date date;

    @PodamExclude
    @ManyToOne
    private UserEntity user;
}