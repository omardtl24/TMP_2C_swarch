package com.cuentas_claras.backend.dto;

public class UserRegistrationDTO {
    private String username;
    private boolean aceptaPoliticas;

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public boolean isAceptaPoliticas() {
        return aceptaPoliticas;
    }
    public void setAceptaPoliticas(boolean aceptaPoliticas) {
        this.aceptaPoliticas = aceptaPoliticas;
    }
}
