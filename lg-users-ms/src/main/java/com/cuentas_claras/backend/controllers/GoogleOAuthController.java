package com.cuentas_claras.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpMethod;
import com.cuentas_claras.backend.services.UserService;
import com.cuentas_claras.backend.models.UserEntity;
import com.cuentas_claras.backend.utils.JwtUtil;
import java.util.Map;
import java.util.Optional;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/auth")
public class GoogleOAuthController {

    @Value("${GOOGLE_OAUTH_CLIENT_ID}")
    private String clientId;

    @Value("${GOOGLE_OAUTH_REDIRECT_URI}")
    private String redirectUri;

    @Autowired
    private UserService userService;

    @Value("${GOOGLE_OAUTH_CLIENT_SECRET}")
    private String clientSecret;

    @Value("${jwt.session-duration-seconds:86400}")
    private int jwtSessionDurationSeconds;

    @GetMapping("/google-redirect")
    public ResponseEntity<?> redirectToGoogle() {
        String state = UUID.randomUUID().toString(); // Puedes guardar este state en cookie o sesión si quieres CSRF
        String authUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=" + URLEncoder.encode(clientId, StandardCharsets.UTF_8) +
                "&redirect_uri=" + URLEncoder.encode(redirectUri, StandardCharsets.UTF_8) +
                "&response_type=code" +
                "&scope=" + URLEncoder.encode("openid email profile", StandardCharsets.UTF_8) +
                "&state=" + URLEncoder.encode(state, StandardCharsets.UTF_8);
        return ResponseEntity.ok(java.util.Map.of("authUrl", authUrl, "state", state));
    }

    @GetMapping("/google/callback")
    @SuppressWarnings({"unchecked", "rawtypes"})
    public ResponseEntity<?> googleCallback(
            @RequestParam String code
    ) {
        try {
            // Intercambiar code por access_token
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("code", code);
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("redirect_uri", redirectUri);
            params.add("grant_type", "authorization_code");
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://oauth2.googleapis.com/token",
                    request,
                    Map.class
            );
            String accessToken = (String) response.getBody().get("access_token");
            // Obtener datos del usuario
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.setBearerAuth(accessToken);
            HttpEntity<Void> userRequest = new HttpEntity<>(userHeaders);
            ResponseEntity<Map> userInfo = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    HttpMethod.GET,
                    userRequest,
                    Map.class
            );
            Map<String, Object> user = (Map<String, Object>) userInfo.getBody();
            String email = (String) user.get("email");
            String name = (String) user.get("name");
            Optional<UserEntity> userOpt = userService.findByEmail(email);
            if (userOpt.isPresent()) {
                UserEntity userEntity = userOpt.get();
                String jwt = JwtUtil.generateTokenWithName(userEntity.getId(), userEntity.getEmail(), userEntity.getName(), userEntity.getUsername(), jwtSessionDurationSeconds * 1000L);
                return ResponseEntity.ok(Map.of(
                        "jwt", jwt,
                        "user", Map.of(
                                "id", userEntity.getId(),
                                "email", userEntity.getEmail(),
                                "username", userEntity.getUsername(),
                                "name", userEntity.getName()
                        ),
                        "message", "Login exitoso"
                ));
            } else {
                String tempToken = JwtUtil.generateToken(0L, email, name, 1000 * 60 * 10); // 10 min
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of(
                        "register_token", tempToken,
                        "message", "Usuario no registrado, debe completar registro"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "Error en el login con Google: " + e.getMessage()
            ));
        }
    }
}
