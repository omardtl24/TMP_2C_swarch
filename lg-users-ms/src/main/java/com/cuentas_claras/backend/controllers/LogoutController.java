package com.cuentas_claras.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth/logout")
public class LogoutController {
    @PostMapping
    public ResponseEntity<?> logout(jakarta.servlet.http.HttpServletResponse response) {
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Expira la cookie
        response.addCookie(cookie);
        return ResponseEntity.ok().body(Map.of("message", "Logged out"));
    }
}
