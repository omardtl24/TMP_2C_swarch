package com.cuentas_claras.backend.config;

import java.util.Date;
import java.util.Optional;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.cuentas_claras.backend.models.UserEntity;
import com.cuentas_claras.backend.repositories.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        String email = authentication.getName(); // Obtener el email del usuario autenticado

        System.out.println("Email del usuario autenticado: " + email);
        Optional<UserEntity> user = userRepository.findByEmail(email); // Buscar el usuario en la base de datos

        if (user.isPresent()) {
            // Generar JWT para usuarios existentes
            String token = JWT.create()
                    .withIssuer("tu-app") // opcional: quién emite el token
                    .withSubject(user.get().getId().toString()) // aquí va el userId
                    .withClaim("email", user.get().getEmail()) // agregamos el email también
                    .withIssuedAt(new Date()) // opcional: fecha de emisión
                    .withExpiresAt(new Date(System.currentTimeMillis() + 3600_000)) // expira en 1h
                    .sign(Algorithm.HMAC256("secret"));

            // Crear cookie HTTP-only con el JWT
            Cookie cookie = new Cookie("auth_token", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            response.addCookie(cookie);

            // Redirigir al frontend
            response.sendRedirect("/dashboard");
        } else {
            // Generar token temporal para registro
            String tempToken = JWT.create()
                    .withSubject(email)
                    .withClaim("temporary", true)
                    .sign(Algorithm.HMAC256("secret"));

            // Redirigir al frontend con el token temporal
            response.sendRedirect("/register?tempToken=" + tempToken);
        }
    }

}
