package com.cuentas_claras.backend.security;

import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                JWTClaimsSet claims = SignedJWT.parse(token).getJWTClaimsSet();

                Long userId = Long.parseLong(claims.getSubject());
                String email = (String) claims.getClaim("email");
                String name = (String) claims.getClaim("name");
                String username = (String) claims.getClaim("userName");

                JwtUserDetails userDetails = new JwtUserDetails(userId, email, name, username);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                logger.error("Failed to parse JWT token: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
