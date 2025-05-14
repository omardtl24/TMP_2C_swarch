package com.cuentas_claras.backend.security.jwt;

import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class TemporaryTokenService {

    private final JwtEncoder jwtEncoder;
    private final RsaKeyProperties props;

    public TemporaryTokenService(JwtEncoder jwtEncoder, RsaKeyProperties props) {
        this.jwtEncoder = jwtEncoder;
        this.props = props;
    }

    public String generate(String email, String name) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .subject(email)
            .issuedAt(now)
            .expiresAt(now.plus(10, ChronoUnit.MINUTES))
            .claim("name", name)
            .build();

        JwsHeader headers = JwsHeader.with(() -> "RS256").build();
        JwtEncoderParameters params = JwtEncoderParameters.from(headers, claims);

        return jwtEncoder.encode(params).getTokenValue();
    }
}
