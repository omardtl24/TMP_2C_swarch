package com.cuentas_claras.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import com.cuentas_claras.backend.services.UserService;
import com.cuentas_claras.backend.utils.JwtUtil;
import com.cuentas_claras.backend.models.UserEntity;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserService userService;

    @Value("${frontend.base-url}")
    private String frontendBaseUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauthUser = oauthToken.getPrincipal();

        String email = (String) oauthUser.getAttributes().get("email");
        System.out.println(" LOGIN EXITOSO - Email: " + email);
        userService.findByEmail(email).ifPresentOrElse(
            user -> {
                // Usuario existe: generar JWT y setear cookie httpOnly
                try {
                    String jwt = JwtUtil.generateToken(user.getId(), user.getEmail(), 1000 * 60 * 60 * 24); // 24h
                    Cookie cookie = new Cookie("jwt", jwt);
                    cookie.setHttpOnly(true);
                    cookie.setPath("/");
                    cookie.setMaxAge(60 * 60 * 24); // 24h
                    response.addCookie(cookie);
                    response.sendRedirect(frontendBaseUrl + "/dashboard");
                } catch (Exception e) {
                    throw new RuntimeException("Error generando JWT", e);
                }
            },
            () -> {
                // Usuario NO existe: generar token temporal y redirigir a registro
                try {
                    String tempToken = JwtUtil.generateToken(0L, email, 1000 * 60 * 10); // 10 min
                    String redirectUrl = frontendBaseUrl + "/complete-signup?email=" + email + "&token=" + tempToken;
                    response.sendRedirect(redirectUrl);
                } catch (Exception e) {
                    throw new RuntimeException("Error generando token temporal", e);
                }
            }
        );
    }
}