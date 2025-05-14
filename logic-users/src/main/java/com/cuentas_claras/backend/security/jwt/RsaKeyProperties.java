package com.cuentas_claras.backend.security.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.core.io.Resource;
import jakarta.annotation.PostConstruct;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.*;
import java.util.Base64;
import java.util.stream.Collectors;


@ConfigurationProperties(prefix = "jwt")
public class RsaKeyProperties {

    /** Inyectadas desde application.properties */
    private Resource publicKeyLocation;
    private Resource privateKeyLocation;

    private String issuer;
    private long expirationMins;

    /** Claves parseadas */
    private RSAPublicKey publicKey;
    private RSAPrivateKey privateKey;

    // Getters / Setters para todas las propiedades
    public Resource getPublicKeyLocation() { return publicKeyLocation; }
    public void setPublicKeyLocation(Resource publicKeyLocation) {
        this.publicKeyLocation = publicKeyLocation;
    }

    public Resource getPrivateKeyLocation() { return privateKeyLocation; }
    public void setPrivateKeyLocation(Resource privateKeyLocation) {
        this.privateKeyLocation = privateKeyLocation;
    }

    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }

    public long getExpirationMins() { return expirationMins; }
    public void setExpirationMins(long expirationMins) { this.expirationMins = expirationMins; }

    public RSAPublicKey getPublicKey() { return publicKey; }
    public RSAPrivateKey getPrivateKey() { return privateKey; }

    @PostConstruct
    public void initKeys() throws Exception {
        KeyFactory kf = KeyFactory.getInstance("RSA");

        // --- Parsear clave pública (siempre X.509) ---
        String pubPem = new BufferedReader(new InputStreamReader(publicKeyLocation.getInputStream()))
            .lines()
            .filter(line -> !line.startsWith("-----"))
            .collect(Collectors.joining());
        byte[] pubBytes = Base64.getDecoder().decode(pubPem);
        X509EncodedKeySpec pubSpec = new X509EncodedKeySpec(pubBytes);
        this.publicKey = (RSAPublicKey) kf.generatePublic(pubSpec);

        // --- Leer PEM completo de la clave privada ---
        String privPem = new BufferedReader(new InputStreamReader(privateKeyLocation.getInputStream()))
            .lines()
            .collect(Collectors.joining("\n"));

        // Extraer sólo contenido Base64
        String base64Body;
        boolean isPkcs1 = privPem.contains("BEGIN RSA PRIVATE KEY");
        if (isPkcs1) {
            base64Body = privPem
                .replaceAll("-----BEGIN RSA PRIVATE KEY-----", "")
                .replaceAll("-----END RSA PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");
            // PKCS#1: necesitamos convertir a PKCS#8
            PKCS8EncodedKeySpec pkcs8Spec = convertPkcs1ToPkcs8(base64Body, kf);
            this.privateKey = (RSAPrivateKey) kf.generatePrivate(pkcs8Spec);
        } else {
            base64Body = privPem
                .replaceAll("-----BEGIN PRIVATE KEY-----", "")
                .replaceAll("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");
            byte[] privBytes = Base64.getDecoder().decode(base64Body);
            PKCS8EncodedKeySpec privSpec = new PKCS8EncodedKeySpec(privBytes);
            this.privateKey = (RSAPrivateKey) kf.generatePrivate(privSpec);
        }
    }

    /**
     * Convierte un PKCS#1 base64Body a un PKCS#8EncodedKeySpec.
     */
    private PKCS8EncodedKeySpec convertPkcs1ToPkcs8(String base64Body, KeyFactory kf) throws Exception {
        byte[] pkcs1Bytes = Base64.getDecoder().decode(base64Body);
        // Construir estructura PKCS#8:
        // SEQUENCE {
        //   INTEGER 0
        //   SEQUENCE { OID rsaEncryption, NULL }
        //   OCTET STRING { <PKCS#1 bytes> }
        // }
        // Encoded manualmente:
        byte[] algId = new byte[]{
            0x30,0x0d,
              0x06,0x09,0x2a,(byte)0x86,0x48,(byte)0x86,(byte)0xf7,0x0d,0x01,0x01,0x01,
              0x05,0x00,
            0x04,(byte)0x82,
            (byte)((pkcs1Bytes.length >> 8) & 0xff),
            (byte)(pkcs1Bytes.length & 0xff)
        };
        byte[] pkcs8bytes = new byte[algId.length + pkcs1Bytes.length];
        System.arraycopy(algId, 0, pkcs8bytes, 0, algId.length);
        System.arraycopy(pkcs1Bytes, 0, pkcs8bytes, algId.length, pkcs1Bytes.length);
        return new PKCS8EncodedKeySpec(pkcs8bytes);
    }
}
