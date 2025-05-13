package com.cuentas_claras.backend.models.sql;

import java.util.ArrayList;
import java.util.List;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

import lombok.Data;
import lombok.EqualsAndHashCode;
import uk.co.jemos.podam.common.PodamExclude;


/**
 * Clase que representa un user en la persistencia.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
public class UserEntity extends BaseEntity {

    private String name;
    private String email;
    private String username;

    @PodamExclude
    @OneToMany(mappedBy = "creator", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<EventEntity> eventsCreated = new ArrayList<>();

    @PodamExclude
    @ManyToMany(mappedBy = "participants", fetch = FetchType.LAZY)
    private List<EventEntity> eventsParticipating = new ArrayList<>();

    @PodamExclude
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PersonalExpenseEntity> personalExpenses = new ArrayList<>();
}