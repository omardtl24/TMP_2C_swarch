package com.cuentas_claras.backend.config;

import com.cuentas_claras.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Deshabilitar CSRF por uso de JWT
                .csrf(csrf -> csrf.disable())
                // No se usan sesiones, cada request es independiente
                .sessionManagement(management -> management
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Agregar filtro de JWT antes del procesamiento de autenticación por formulario
                .addFilterBefore(
                        new JwtAuthenticationFilter(),
                        UsernamePasswordAuthenticationFilter.class
                )
                // Configuración de accesos
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers("/public/**", "/.well-known/jwks.json").permitAll()
                                .anyRequest().authenticated()
                );

        return http.build();
    }
}
