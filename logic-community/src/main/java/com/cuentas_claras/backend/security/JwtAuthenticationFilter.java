package com.cuentas_claras.backend.security;

import com.cuentas_claras.backend.models.UserCache;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Llave secreta compartida con el user-manager 
    private static final String SECRET_KEY = "mi-clave-super-secreta"; //toca mirar como ponemos esto...

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7); // Quitar "Bearer "

        try {
            // Validar y parsear el token
            Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY.getBytes(StandardCharsets.UTF_8))
                .parseClaimsJws(token)
                .getBody();

            String userId = claims.get("id", String.class);
            String email = claims.get("email", String.class);
            String username = claims.get("username", String.class);
            String name = claims.get("name", String.class);

            if (userId != null) {
                // Crear el principal y token de autenticación
                UserCache principal = new UserCache(userId, email, username, name);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                principal,
                                null,
                                List.of() // No usamos roles por ahora
                        );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (JwtException e) {
            // Token inválido o expirado → continuar sin establecer autenticación
            logger.warn("Token JWT inválido: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
