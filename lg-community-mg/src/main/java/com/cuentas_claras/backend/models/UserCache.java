package com.cuentas_claras.backend.models;


import org.springframework.stereotype.Component;
import lombok.AllArgsConstructor;
import lombok.Data;


/**
 * Clase que me ayuda a almacenar info del usuario.
 */
@Component

@Data
@AllArgsConstructor
public class UserCache {

    private String userId;
    private String email;
    private String username;
    private String name;

}