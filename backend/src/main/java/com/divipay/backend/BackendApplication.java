package com.divipay.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
// Point to JPA repo 
@EnableJpaRepositories(basePackages = "com.partipay.backend.repository.sql")
// Point to Mongo repo 
@EnableMongoRepositories(basePackages = "com.partipay.backend.repository.mongo")
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
