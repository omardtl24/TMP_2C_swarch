package com.cuentas_claras.backend.messaging;

import com.cuentas_claras.backend.config.RabbitConfig;
import com.cuentas_claras.backend.dto.ExpenseCreatedEvent;
import com.cuentas_claras.backend.models.sql.PersonalExpenseEntity;
import com.cuentas_claras.backend.services.PersonalExpenseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Date;

@Slf4j
@Component
public class ExpenseCreatedListener {

    private final PersonalExpenseService personalExpenseService;

    public ExpenseCreatedListener(PersonalExpenseService service) {
        this.personalExpenseService = service;
    }

    @RabbitListener(queues = RabbitConfig.EXPENSE_CREATED_QUEUE)
    public void handleExpenseCreated(ExpenseCreatedEvent event) {
        log.info("Recibido evento ExpenseCreated: {}", event.getExpenseId());
        event.getParticipation().forEach(part -> {
            PersonalExpenseEntity pe = new PersonalExpenseEntity();
            pe.setConcept(event.getConcept());
            pe.setType(Enum.valueOf(
                com.cuentas_claras.backend.models.enums.ExpenseType.class,
                event.getType()));
            pe.setTotal((float) part.getPortion());
            pe.setDate(new Date());
            pe.setOwnerId(part.getUserId());
            try {
                personalExpenseService.createPersonalExpenseForUser(part.getUserId(), pe);
            } catch (Exception e) {
                log.error("Error creando gasto personal para usuario {}: {}",
                          part.getUserId(), e.getMessage());
            }
        });
    }
}