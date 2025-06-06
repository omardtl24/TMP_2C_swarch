package com.cuentas_claras.backend.security;

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

        String userIdHeader = request.getHeader("x-user-id");
        String userEmail = request.getHeader("x-user-email");
        String userUsername = request.getHeader("x-user-username");
        String userName = request.getHeader("x-user-name");

        if (userIdHeader != null) {
            try {
                Long userId = Long.parseLong(userIdHeader);

                JwtUserDetails userDetails = new JwtUserDetails(
                        userId,
                        userEmail != null ? userEmail : "",
                        userName != null ? userName : "",
                        userUsername != null ? userUsername : ""
                );

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (NumberFormatException e) {
                logger.error("Invalid user ID in header: " + userIdHeader, e);
            } catch (Exception e) {
                logger.error("Failed to set authentication context: " + e.getMessage(), e);
            }
        }

        filterChain.doFilter(request, response);
    }
}
