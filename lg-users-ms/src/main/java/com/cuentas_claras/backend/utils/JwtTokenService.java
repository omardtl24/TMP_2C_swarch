package com.cuentas_claras.backend.utils;

import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtTokenService {
    public String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public JWTClaimsSet validateAndGetClaims(String token) {
        if (token == null || !JwtUtil.validateToken(token)) {
            throw new RuntimeException("Token inválido o expirado");
        }
        try {
            return JwtUtil.getClaims(token);
        } catch (Exception e) {
            throw new RuntimeException("Error extrayendo claims del token", e);
        }
    }

    public Long getUserIdFromRequest(HttpServletRequest request) {
        String token = extractToken(request);
        JWTClaimsSet claims = validateAndGetClaims(token);
        return Long.valueOf(claims.getSubject());
    }
}
