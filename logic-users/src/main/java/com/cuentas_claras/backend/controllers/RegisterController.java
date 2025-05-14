package com.cuentas_claras.backend.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

import com.cuentas_claras.backend.dto.UserRegistrationDTO;
import com.cuentas_claras.backend.models.UserEntity;
import com.cuentas_claras.backend.repositories.UserRepository;
import com.cuentas_claras.backend.security.jwt.RsaKeyProperties;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class RegisterController {

    @Autowired private JwtDecoder jwtDecoder;
    @Autowired private UserRepository userRepo;
    @Autowired private JwtEncoder jwtEncoder;
    @Autowired private RsaKeyProperties props;

    @PostMapping("/register-complete")
    public ResponseEntity<Map<String,String>> completeRegistration(
        @RequestHeader("Authorization") String tempToken,
        @RequestBody UserRegistrationDTO dto) {

        String token = tempToken.replace("Bearer ", "");
        Jwt jwt = jwtDecoder.decode(token);
        String email = jwt.getSubject();
        String name = jwt.getClaim("name");

        // Crear usuario definitivo
        UserEntity user = new UserEntity();
        user.setEmail(email);
        user.setName(name);
        user.setUsername(dto.getUsername());
        userRepo.save(user);

        // Generar JWT final
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer(props.getIssuer())
            .subject(email)
            .issuedAt(now)
            .expiresAt(now.plus(props.getExpirationMins(), ChronoUnit.MINUTES))
            .claim("name", name)
            .build();

        JwsHeader headers = JwsHeader.with(() -> "RS256").build();
        JwtEncoderParameters params = JwtEncoderParameters.from(headers, claims);
        String finalToken = jwtEncoder.encode(params).getTokenValue();

        // Devolver cookie HttpOnly
        ResponseCookie cookie = ResponseCookie.from("SESSION_JWT", finalToken)
            .httpOnly(true)
            .path("/")
            .maxAge(props.getExpirationMins() * 60)
            .build();

        return ResponseEntity.ok()
            .header("Set-Cookie", cookie.toString())
            .body(Map.of("status", "registered"));
    }
}
