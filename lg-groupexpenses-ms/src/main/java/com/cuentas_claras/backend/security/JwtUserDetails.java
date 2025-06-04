package com.cuentas_claras.backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;

public class JwtUserDetails implements UserDetails {

    private Long userId;
    private String email;
    private String name;
    private String username;

    public JwtUserDetails(Long userId, String email, String name, String username) {
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.username = username;
    }

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return name;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        
        return java.util.Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return null; 
    }

    @Override
    public String getUsername() {
        return username; 
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}
