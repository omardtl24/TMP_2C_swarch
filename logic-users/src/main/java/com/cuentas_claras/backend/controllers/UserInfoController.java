package com.cuentas_claras.backend.controllers;

import com.cuentas_claras.backend.models.UserEntity;
import com.cuentas_claras.backend.services.UserService;
import com.cuentas_claras.backend.utils.JwtUtil;
import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CookieValue;

import java.util.Optional;

@RestController
public class UserInfoController {
    @Autowired
    private UserService userService;

    @GetMapping("/auth/me")
    public ResponseEntity<?> getUserInfo(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                         @CookieValue(value = "jwt", required = false) String jwtCookie) {
        try {
            String token = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            } else if (jwtCookie != null) {
                token = jwtCookie;
            } else {
                return ResponseEntity.status(401).body(java.util.Map.of("error", "No JWT token provided"));
            }
            if (!JwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body(java.util.Map.of("error", "Token inválido o expirado"));
            }
            JWTClaimsSet claims = JwtUtil.getClaims(token);
            Long userId = Long.valueOf(claims.getSubject());
            Optional<UserEntity> userOpt = userService.getUsers().stream().filter(u -> u.getId().equals(userId)).findFirst();
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(java.util.Map.of("error", "Usuario no encontrado"));
            }
            UserEntity user = userOpt.get();
            // Devuelve solo info básica, no sensible
            return ResponseEntity.ok(new UserInfoResponse(user.getId(), user.getEmail(), user.getUsername(), user.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Error consultando usuario: " + e.getMessage()));
        }
    }

    public static class UserInfoResponse {
        public Long id;
        public String email;
        public String username;
        public String name;
        public UserInfoResponse(Long id, String email, String username, String name) {
            this.id = id;
            this.email = email;
            this.username = username;
            this.name = name;
        }
    }
}
