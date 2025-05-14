package com.cuentas_claras.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.beans.factory.annotation.Autowired;

import com.cuentas_claras.backend.security.jwt.RsaKeyProperties;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtEncoder jwtEncoder;

    @Autowired
    private RsaKeyProperties props;

    @GetMapping("/token")
    public Map<String, String> issueToken(@AuthenticationPrincipal OidcUser user) {
        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer(props.getIssuer())
            .subject(user.getEmail())
            .issuedAt(now)
            .expiresAt(now.plus(props.getExpirationMins(), ChronoUnit.MINUTES))
            .claim("name", user.getFullName())
            .build();

        JwsHeader headers = JwsHeader.with(() -> "RS256").build();
        JwtEncoderParameters params = JwtEncoderParameters.from(headers, claims);
        String token = jwtEncoder.encode(params).getTokenValue();

        return Map.of("access_token", token);
    }
}
