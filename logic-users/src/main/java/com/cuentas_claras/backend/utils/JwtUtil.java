package com.cuentas_claras.backend.utils;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

public class JwtUtil {
    private static PrivateKey getPrivateKey() throws Exception {
        String key = System.getenv("PRIVATE_KEY");
        if (key == null) throw new IllegalStateException("PRIVATE_KEY env var not set");
        key = key.replace("-----BEGIN PRIVATE KEY-----", "")
                 .replace("-----END PRIVATE KEY-----", "")
                 .replace("\\n", "")
                 .replaceAll("\\s", "");
        System.out.println(key);
        byte[] keyBytes = Base64.getDecoder().decode(key);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(spec);
    }

    private static PublicKey getPublicKey() throws Exception {
        String key = System.getenv("PUBLIC_KEY");
        if (key == null) throw new IllegalStateException("PUBLIC_KEY env var not set");
        key = key.replace("-----BEGIN PUBLIC KEY-----", "")
                 .replace("-----END PUBLIC KEY-----", "")
                 .replace("\\n", "")
                 .replaceAll("\\s", "");
        byte[] keyBytes = Base64.getDecoder().decode(key);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePublic(spec);
    }

    public static String generateToken(Long userId, String email, String name, long expirationMillis) throws Exception {
        JWSSigner signer = new RSASSASigner(getPrivateKey());
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(userId.toString())
                .claim("email", email)
                .claim("name", name)
                .expirationTime(new Date(System.currentTimeMillis() + expirationMillis))
                .build();
        SignedJWT signedJWT = new SignedJWT(
                new JWSHeader.Builder(JWSAlgorithm.RS256).type(JOSEObjectType.JWT).build(),
                claimsSet);
        signedJWT.sign(signer);
        return signedJWT.serialize();
    }

    public static String generateTokenWithName(Long userId, String email, String name, String userName, long expirationMillis) throws Exception {
        JWSSigner signer = new RSASSASigner(getPrivateKey());
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(userId.toString())
                .claim("email", email)
                .claim("name", name)
                .claim("userName", userName)
                .expirationTime(new Date(System.currentTimeMillis() + expirationMillis))
                .build();
        SignedJWT signedJWT = new SignedJWT(
                new JWSHeader.Builder(JWSAlgorithm.RS256).type(JOSEObjectType.JWT).build(),
                claimsSet);
        signedJWT.sign(signer);
        return signedJWT.serialize();
    }

    public static boolean validateToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new RSASSAVerifier((RSAPublicKey) getPublicKey());
            return signedJWT.verify(verifier) &&
                    new Date().before(signedJWT.getJWTClaimsSet().getExpirationTime());
        } catch (Exception e) {
            return false;
        }
    }

    public static JWTClaimsSet getClaims(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        return signedJWT.getJWTClaimsSet();
    }
}
