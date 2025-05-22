package com.cuentas_claras.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.MediaType;
import java.security.interfaces.RSAPublicKey;
import java.security.KeyFactory;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Collections;
import java.util.Map;
import org.springframework.web.bind.annotation.ResponseBody;

@RestController
@RequestMapping("/.well-known")
public class PublicKeyController {
    @GetMapping(value = "/jwks.json", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> getJwks() throws Exception {
        // Lee la clave pública desde la variable de entorno PUBLIC_KEY
        String key = System.getenv("PUBLIC_KEY");
        if (key == null) throw new IllegalStateException("PUBLIC_KEY env var not set");
        key = key.replace("-----BEGIN PUBLIC KEY-----", "")
                 .replace("-----END PUBLIC KEY-----", "")
                 .replace("\\n", "")
                 .replaceAll("\\s", "");
        byte[] keyBytes = Base64.getDecoder().decode(key);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        RSAPublicKey rsaPublicKey = (RSAPublicKey) kf.generatePublic(spec);
        String n = Base64.getUrlEncoder().withoutPadding().encodeToString(rsaPublicKey.getModulus().toByteArray());
        String e = Base64.getUrlEncoder().withoutPadding().encodeToString(rsaPublicKey.getPublicExponent().toByteArray());
        Map<String, Object> jwk = Map.of(
            "kty", "RSA",
            "alg", "RS256",
            "use", "sig",
            "n", n,
            "e", e,
            "kid", "1"
        );
        return Collections.singletonMap("keys", Collections.singletonList(jwk));
    }
}
