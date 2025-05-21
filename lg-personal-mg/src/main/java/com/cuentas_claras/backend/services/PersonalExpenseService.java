package com.cuentas_claras.backend.services;


import com.cuentas_claras.backend.config.UserManagerConfig;
import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.IllegalOperationException;
import com.cuentas_claras.backend.models.sql.PersonalExpenseEntity;
import com.cuentas_claras.backend.repositories.sql.PersonalExpenseRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PersonalExpenseService {

    @Autowired
    private PersonalExpenseRepository personalExpenseRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserManagerConfig userConfig;

    // --- Create a expense ---
    @Transactional
    public PersonalExpenseEntity createPersonalExpense(PersonalExpenseEntity expense) throws EntityNotFoundException, IllegalOperationException {

        verifyUserExists(expense.getOwner());
        
        validate(expense);
        return  personalExpenseRepository.save(expense);
    }

    // --- Get only ONE expense ---
    @Transactional
    public PersonalExpenseEntity getUserExpense(Long expenseId) throws EntityNotFoundException {
        return personalExpenseRepository.findById(expenseId)
            .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado: " + expenseId));
    }

    // --- Get ALL expenses ---
    @Transactional
    public List<PersonalExpenseEntity> getUserExpenses(Long userId) throws EntityNotFoundException {
        verifyUserExists(userId);
        return personalExpenseRepository.findByOwner(userId);
    }

    // --- Get specific expenses between dates ---
    @Transactional
     public List<PersonalExpenseEntity> getUserExpensesBetweenDates(Long userId, LocalDate start, LocalDate end) throws EntityNotFoundException {
        verifyUserExists(userId);
        return personalExpenseRepository.findByOwnerAndDateBetween(userId, start, end);
    }

    @Transactional(readOnly = true)
    public Float getTotalPersonalExpensesByUserId(Long userId) throws EntityNotFoundException {
        verifyUserExists(userId); // Confirm user exists via user-manager

        List<PersonalExpenseEntity> expenses = personalExpenseRepository.findByOwner(userId);

        return expenses.stream()
                .map(PersonalExpenseEntity::getTotal)
                .filter(Objects::nonNull)
                .reduce(0f, Float::sum);
    }



    // --- Update an expense ---
    @Transactional
    public PersonalExpenseEntity updatePersonalExpense(Long expenseId, PersonalExpenseEntity updatedExpense) throws EntityNotFoundException, IllegalOperationException {

        PersonalExpenseEntity existingExpense = personalExpenseRepository.findById(expenseId)
            .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado: " + expenseId));
        
        validate(updatedExpense);
        updatedExpense.setId(expenseId);
        updatedExpense.setOwner(existingExpense.getOwner());

        return  personalExpenseRepository.save(updatedExpense);
    }

    // --- Delete an Expense ---
    @Transactional
    public void deletePersonalExpense(Long expenseId) throws EntityNotFoundException {
        PersonalExpenseEntity expense = personalExpenseRepository.findById(expenseId)
                .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado"));

        personalExpenseRepository.delete(expense);
    }


    private void verifyUserExists(Long userId) throws EntityNotFoundException {
        String url = userConfig.getUrl() + "/api/users/exists/" + userId;
        ResponseEntity<Boolean> resp = restTemplate.getForEntity(url, Boolean.class);
        if (!Boolean.TRUE.equals(resp.getBody())) {
            throw new EntityNotFoundException("Usuario no existe: " + userId);
        }
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

