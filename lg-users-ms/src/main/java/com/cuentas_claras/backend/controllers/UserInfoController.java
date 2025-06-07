package com.cuentas_claras.backend.controllers;

import com.cuentas_claras.backend.models.UserEntity;
import com.cuentas_claras.backend.services.UserService;
import com.cuentas_claras.backend.utils.JwtTokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class UserInfoController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtTokenService jwtTokenService;

    @GetMapping("/auth/me")
    public ResponseEntity<?> getUserInfo(HttpServletRequest request) {
        try {
            Long userId = jwtTokenService.getUserIdFromRequest(request);
            Optional<UserEntity> userOpt = userService.getUsers().stream().filter(u -> u.getId().equals(userId)).findFirst();
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body(java.util.Map.of("error", "Usuario no encontrado"));
            }
            UserEntity user = userOpt.get();
            return ResponseEntity.ok(new UserInfoResponse(user.getId(), user.getEmail(), user.getUsername(), user.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Error consultando usuario: " + e.getMessage()));
        }
    }

@GetMapping("/{id_user}")
    public ResponseEntity<?> getUserById(@PathVariable("id_user") Long id_user) {
        try {
            UserEntity user = userService.getUser(id_user);
            return ResponseEntity.ok(user);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(java.util.Map.of("error", "Usuario no encontrado"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Error consultando usuario: " + e.getMessage()));
        }
    }


    @DeleteMapping("/auth/me")
    public ResponseEntity<?> deleteUserAccount(HttpServletRequest request) {
        try {
            Long userId = jwtTokenService.getUserIdFromRequest(request);
            userService.deleteUser(userId);
            return ResponseEntity.ok(java.util.Map.of("message", "Usuario eliminado correctamente"));
        } catch (com.cuentas_claras.backend.exceptions.EntityNotFoundException e) {
            return ResponseEntity.status(404).body(java.util.Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Error eliminando usuario: " + e.getMessage()));
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
