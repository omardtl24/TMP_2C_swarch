package com.cuentas_claras.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.cuentas_claras.backend.security.jwt.RsaKeyProperties;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.cuentas_claras.backend.repositories")
@EnableConfigurationProperties(RsaKeyProperties.class)
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
