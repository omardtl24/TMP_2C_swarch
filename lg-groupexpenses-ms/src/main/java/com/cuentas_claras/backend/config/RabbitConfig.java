package com.cuentas_claras.backend.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String EXPENSE_CREATED_QUEUE = "expense.created.queue";

    @Bean
    Queue expenseCreatedQueue() {
        return new Queue(EXPENSE_CREATED_QUEUE, true);
    }
}