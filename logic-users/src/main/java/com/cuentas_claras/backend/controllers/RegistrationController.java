package com.cuentas_claras.backend.controllers;

import com.cuentas_claras.backend.models.UserEntity;
import com.cuentas_claras.backend.services.UserService;
import com.cuentas_claras.backend.utils.JwtUtil;
import com.cuentas_claras.backend.dto.UserRegistrationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequestMapping("/auth")
public class RegistrationController {
    @Autowired
    private UserService userService;

    @Value("${jwt.session-duration-seconds:86400}")
    private int jwtSessionDurationSeconds;

    @PostMapping("/register")
    public ResponseEntity<?> completeSignup(@RequestBody UserRegistrationDTO payload) {
        try {
            String email = payload.getEmail();
            String token = payload.getToken();
            String username = payload.getUsername();
            String name = JwtUtil.getClaims(token).getStringClaim("name");
            // Validar el token temporal y el email
            if (!JwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body("Token inválido o expirado");
            }
            String tokenEmail = JwtUtil.getClaims(token).getStringClaim("email");
            if (!email.equals(tokenEmail)) {
                return ResponseEntity.status(401).body("El email no coincide con el token");
            }
            // Verificar que el usuario no exista (En teoria nunca se ejeuta esto)
            if (userService.findByEmail(email).isPresent()) {
                return ResponseEntity.status(409).body("El usuario ya existe");
            }
            // Crear el usuario
            UserEntity user = new UserEntity();
            user.setEmail(email);
            user.setUsername(username);
            user.setName(name);
            userService.save(user);
            // Autenticar automáticamente: generar JWT y setear cookie httpOnly
            try {
                String jwt = JwtUtil.generateToken(user.getId(), user.getEmail(), jwtSessionDurationSeconds * 1000L);
                jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("jwt", jwt);
                cookie.setHttpOnly(true);
                cookie.setPath("/");
                cookie.setMaxAge(jwtSessionDurationSeconds);
                ((jakarta.servlet.http.HttpServletResponse) ((org.springframework.web.context.request.ServletRequestAttributes) org.springframework.web.context.request.RequestContextHolder.getRequestAttributes()).getResponse()).addCookie(cookie);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Usuario creado pero error generando JWT: " + e.getMessage());
            }
            return ResponseEntity.ok("Usuario registrado y autenticado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error en el registro: " + e.getMessage());
        }
    }
}
