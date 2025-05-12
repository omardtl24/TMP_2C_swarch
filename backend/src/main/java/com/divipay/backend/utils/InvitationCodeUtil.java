package com.divipay.backend.utils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

public class InvitationCodeUtil {

    public static String generateCodeFromId(Long eventId) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(String.valueOf(eventId).getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash).substring(0, 6);
        } catch (Exception e) {
            throw new RuntimeException("Error generando código de invitación", e);
        }
    }
}