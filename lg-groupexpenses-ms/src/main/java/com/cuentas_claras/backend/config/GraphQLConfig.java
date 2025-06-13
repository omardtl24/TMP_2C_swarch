package com.cuentas_claras.backend.config;

import graphql.scalars.ExtendedScalars;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.RuntimeWiringConfigurer;

@Configuration
public class GraphQLConfig {

  @Bean
  public RuntimeWiringConfigurer wiringConfigurer() {
    return builder -> builder
      .scalar(UploadScalar.build())
      .scalar(ExtendedScalars.Date);
  }
}

