package com.cuentas_claras.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;


/**
 * Clase que me ayuda a almacenar info del usuario.
 */
@Data
@AllArgsConstructor
public class UserCache {

    private String userId;
    private String email;
    private String username;
    private String name;

}