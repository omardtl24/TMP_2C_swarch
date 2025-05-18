package com.cuentas_claras.backend.config;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class RestConfig {
    @Value("${frontend.base-url}")
    private String frontendBaseUrl;

	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}
	
	@Bean
	public WebMvcConfigurer corsConfigurer() {
        if (frontendBaseUrl == null || frontendBaseUrl.isBlank()) {
            System.err.println("[CORS] frontend.base-url is not set or is blank!");
            throw new IllegalStateException("frontend.base-url is not set or is blank!");
        }
        System.out.println("[CORS] frontend.base-url used: " + frontendBaseUrl);
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
                // Permite CORS público para JWKS sin credenciales
                registry.addMapping("/.well-known/jwks.json")
                    .allowedOrigins("*")
                    .allowedMethods("GET")
                    .allowedHeaders("*")
                    .maxAge(3600);
                // CORS seguro para el resto de la app
				registry.addMapping("/**")
					.allowedOrigins(frontendBaseUrl.trim())
					.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
					.allowedHeaders("*")
					.allowCredentials(true)
					.maxAge(3600);
			}
		};
	}
}
