package com.cuentas_claras.backend.models;

import jakarta.persistence.Entity;

import lombok.Data;
import lombok.EqualsAndHashCode;


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
}