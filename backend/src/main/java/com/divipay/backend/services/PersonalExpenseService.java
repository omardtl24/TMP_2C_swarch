package com.divipay.backend.services;


import com.divipay.backend.exceptions.EntityNotFoundException;
import com.divipay.backend.exceptions.IllegalOperationException;
import com.divipay.backend.models.sql.UserEntity;
import com.divipay.backend.models.sql.PersonalExpenseEntity;
import com.divipay.backend.repositories.sql.UserRepository;
import com.divipay.backend.repositories.sql.PersonalExpenseRepository;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PersonalExpenseService {

    @Autowired
    private PersonalExpenseRepository personalExpenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public PersonalExpenseEntity createPersonalExpense(Long userId, PersonalExpenseEntity expense)
            throws EntityNotFoundException, IllegalOperationException {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        validate(expense);

        expense.setOwner(user);
        return personalExpenseRepository.save(expense);
    }

    @Transactional(readOnly = true)
    public List<PersonalExpenseEntity> getUserExpenses(Long userId) throws EntityNotFoundException {
        userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        return personalExpenseRepository.findByOwner_Id(userId);
    }

    @Transactional
    public void deletePersonalExpense(Long expenseId) throws EntityNotFoundException {
        PersonalExpenseEntity expense = personalExpenseRepository.findById(expenseId)
                .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado"));

        personalExpenseRepository.delete(expense);
    }

    private void validate(PersonalExpenseEntity e) throws IllegalOperationException {
        if (e.getConcept() == null || e.getConcept().trim().isEmpty())
            throw new IllegalOperationException("El concepto no puede ser vacío");
        if (e.getTotal() == null || e.getTotal() <= 0)
            throw new IllegalOperationException("Total inválido");
        if (e.getType() == null)
            throw new IllegalOperationException("Tipo no puede ser nulo");
        if (e.getDate() == null)
            throw new IllegalOperationException("La fecha del gasto es requerida");
    }
}

