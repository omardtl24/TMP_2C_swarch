package com.cuentas_claras.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // CORS deshabilitado - solo llamadas server-to-server
        // registry.addMapping("/**")
        //     .allowedOrigins("http://localhost:8000")
        //     .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        //     .allowedHeaders("*")
        //     .allowCredentials(true)
        //     .maxAge(3600);
    }
}