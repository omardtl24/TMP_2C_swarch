package com.cuentas_claras.backend.security;

import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.cuentas_claras.backend.repositories.UserRepository;
import com.cuentas_claras.backend.security.jwt.TemporaryTokenService;

@Service
public class CustomOidcUserService extends OidcUserService {

    @Autowired private UserRepository userRepo;
    @Autowired private TemporaryTokenService tempService;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);
        String email = oidcUser.getEmail();
        String name  = oidcUser.getFullName();

        if (userRepo.findByEmail(email).isEmpty()) {
            String tempToken = tempService.generate(email, name);
            throw new OAuth2AuthenticationException(
                "redirect_to_register:token=" + tempToken
            );
        }

        return oidcUser;
    }
}
