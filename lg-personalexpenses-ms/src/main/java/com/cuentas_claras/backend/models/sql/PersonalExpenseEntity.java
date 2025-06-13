package com.cuentas_claras.backend.models.sql;

import java.util.Date;

import com.cuentas_claras.backend.models.enums.ExpenseType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;
import lombok.EqualsAndHashCode;


@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class PersonalExpenseEntity extends BaseEntity {

    private String concept;
    private String ownerId;


    @Enumerated(EnumType.STRING)
    private ExpenseType type;

    private Float total;

    @Temporal(TemporalType.DATE)
    private Date date;

}