package com.divipay.backend.services;


import com.divipay.backend.exceptions.EntityNotFoundException;
import com.divipay.backend.exceptions.IllegalOperationException;
import com.divipay.backend.models.sql.EventEntity;
import com.divipay.backend.models.sql.UserEntity;
import com.divipay.backend.models.sql.ExpenseEntity;
import com.divipay.backend.models.mongo.ExpenseDocument;
import com.divipay.backend.repositories.sql.EventRepository;
import com.divipay.backend.repositories.sql.UserRepository;
import com.divipay.backend.repositories.sql.ExpenseSQLRepository;
import com.divipay.backend.repositories.mongo.ExpenseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ExpenseService {

    @Autowired
    private ExpenseSQLRepository expenseSQLRepository;

    @Autowired
    private ExpenseRepository expenseMongoRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ExpenseEntity createExpense(Long eventId, Long payerId, ExpenseDocument expenseDoc)
            throws EntityNotFoundException, IllegalOperationException {

        log.info("Creando gasto para evento {}", eventId);

        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado"));

        UserEntity payer = userRepository.findById(payerId)
                .orElseThrow(() -> new EntityNotFoundException("Pagador no encontrado"));

        if (!event.getParticipants().contains(payer)) {
            throw new IllegalOperationException("El pagador no es participante del evento");
        }

        expenseDoc.setPayerId(payerId.toString());
        ExpenseDocument savedDoc = expenseMongoRepository.save(expenseDoc);

        ExpenseEntity expenseEntity = new ExpenseEntity();
        expenseEntity.setEvent(event);
        expenseEntity.setPayer(payer);
        expenseEntity.setExternalDocId(savedDoc.getId());

        return expenseSQLRepository.save(expenseEntity);
    }

    @Transactional(readOnly = true)
    public ExpenseDocument getExpenseDetails(Long expenseId) throws EntityNotFoundException {
        ExpenseEntity sqlExpense = expenseSQLRepository.findById(expenseId)
                .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado"));

        return expenseMongoRepository.findById(sqlExpense.getExternalDocId())
                .orElseThrow(() -> new EntityNotFoundException("Documento de gasto no encontrado"));
    }

    @Transactional
    public void deleteExpense(Long expenseId) throws EntityNotFoundException {
        ExpenseEntity expense = expenseSQLRepository.findById(expenseId)
                .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado"));

        expenseMongoRepository.deleteById(expense.getExternalDocId());
        expenseSQLRepository.deleteById(expenseId);
    }

    @Transactional
    public void updateExpense(Long expenseId, ExpenseDocument updatedDoc)
            throws EntityNotFoundException {

        ExpenseEntity expenseEntity = expenseSQLRepository.findById(expenseId)
                .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado"));

        updatedDoc.setId(expenseEntity.getExternalDocId());
        expenseMongoRepository.save(updatedDoc);
    }
}
