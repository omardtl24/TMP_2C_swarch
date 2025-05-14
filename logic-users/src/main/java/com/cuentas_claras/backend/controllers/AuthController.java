package com.cuentas_claras.backend.controllers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");

        // Simular verificación en la base de datos
        boolean userExists = checkUserExists(email);

        if (userExists) {
            // Generar JWT para usuarios existentes
            String token = JWT.create()
                    .withSubject(email)
                    .sign(Algorithm.HMAC256("secret"));

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            // Generar token temporal para registro
            String tempToken = JWT.create()
                    .withSubject(email)
                    .withClaim("temporary", true)
                    .sign(Algorithm.HMAC256("secret"));

            Map<String, String> response = new HashMap<>();
            response.put("tempToken", tempToken);
            return ResponseEntity.status(302).body(response);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getAuthenticatedUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Usuario no autenticado");
        }

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("name", principal.getAttribute("name"));
        userInfo.put("email", principal.getAttribute("email"));

        return ResponseEntity.ok(userInfo);
    }

    private boolean checkUserExists(String email) {
        // Simular lógica de verificación en la base de datos
        return false; // Cambiar según la lógica real
    }
}
