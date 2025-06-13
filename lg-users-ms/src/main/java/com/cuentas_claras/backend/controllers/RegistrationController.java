package com.cuentas_claras.backend.controllers;

import com.cuentas_claras.backend.models.UserEntity;
import com.cuentas_claras.backend.services.UserService;
import com.cuentas_claras.backend.utils.JwtUtil;
import com.cuentas_claras.backend.dto.UserRegistrationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class RegistrationController {
    @Autowired
    private UserService userService;

    @Value("${jwt.session-duration-seconds:86400}")
    private int jwtSessionDurationSeconds;

    @PostMapping("/register")
    public ResponseEntity<?> completeSignup(
        @RequestBody UserRegistrationDTO payload,
        @CookieValue(value = "register_token", required = false) String token
    ) {
        try {
            String email = payload.getEmail();
            String username = payload.getUsername();
            String name = null;
            String tokenEmail = null;
            if (token != null) {
                try {
                    name = JwtUtil.getClaims(token).getStringClaim("name");
                    tokenEmail = JwtUtil.getClaims(token).getStringClaim("email");
                } catch (Exception e) {
                    System.out.println("[DEBUG] Error extrayendo claims del token: " + e.getMessage());
                }
            }
            // Validar el token temporal y el email
            if (!JwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body(Map.of("error", "Token inválido o expirado"));
            }
            if (!email.equals(tokenEmail)) {
                return ResponseEntity.status(401).body(Map.of("error", "El email no coincide con el token"));
            }
            // Verificar que el usuario no exista
            if (userService.findByEmail(email).isPresent()) {
                return ResponseEntity.status(409).body(Map.of("error", "El usuario ya existe"));
            }
            // Crear el usuario
            UserEntity user = new UserEntity();
            user.setEmail(email);
            user.setUsername(username);
            user.setName(name);
            userService.save(user);
            // Generar JWT y devolverlo en la respuesta (el frontend setea la cookie y elimina register_token)
            try {
                String jwt = JwtUtil.generateTokenWithName(user.getId(), user.getEmail(), user.getName(), user.getUsername(), jwtSessionDurationSeconds * 1000L);
                return ResponseEntity.ok(Map.of(
                    "jwt", jwt,
                    "user", Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "username", user.getUsername(),
                        "name", user.getName()
                    ),
                    "message", "Usuario registrado y autenticado exitosamente"
                ));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of("error", "Usuario creado pero error generando JWT: " + e.getMessage()));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error en el registro: " + e.getMessage()));
        }
    }
}
