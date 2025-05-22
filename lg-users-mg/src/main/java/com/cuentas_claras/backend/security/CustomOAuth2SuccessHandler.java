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
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserService userService;

    @Value("${frontend.base-url}")
    private String frontendBaseUrl;

    @Value("${jwt.session-duration-seconds:86400}")
    private int jwtSessionDurationSeconds;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauthUser = oauthToken.getPrincipal();

        String email = (String) oauthUser.getAttributes().get("email");
        userService.findByEmail(email).ifPresentOrElse(
            user -> {
                // Usuario existe: generar JWT y setear cookie httpOnly
                try {
                    String jwt = JwtUtil.generateTokenWithName(user.getId(), user.getEmail(), user.getName(), user.getUsername(), jwtSessionDurationSeconds * 1000L);
                    Cookie jwtCookie = new Cookie("jwt", jwt);
                    jwtCookie.setHttpOnly(true);
                    jwtCookie.setPath("/");
                    jwtCookie.setMaxAge(jwtSessionDurationSeconds);
                    response.addCookie(jwtCookie);
                    String redirectUrl = frontendBaseUrl + "/eventBoard";
                    response.sendRedirect(redirectUrl);
                } catch (Exception e) {
                    throw new RuntimeException("Error generando JWT", e);
                }
            },
            () -> {
                // Usuario NO existe: generar token temporal y redirigir a registro
                try {
                    String name = (String) oauthUser.getAttributes().get("name");
                    String tempToken = JwtUtil.generateToken(0L, email, name, 1000 * 60 * 10); // 10 min
                    Cookie tempCookie = new Cookie("register_token", tempToken);
                    tempCookie.setHttpOnly(true);
                    tempCookie.setPath("/");
                    tempCookie.setMaxAge(600); // 10 min
                    response.addCookie(tempCookie);
                    String redirectUrl = frontendBaseUrl + "/register?email=" + email;
                    response.sendRedirect(redirectUrl);
                } catch (Exception e) {
                    throw new RuntimeException("Error generando token temporal", e);
                }
            }
        );
    }
}