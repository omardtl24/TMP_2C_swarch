package com.cuentas_claras.backend.services;

import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.IllegalOperationException;
import com.cuentas_claras.backend.models.sql.PersonalExpenseEntity;
import com.cuentas_claras.backend.models.enums.ExpenseType;
import com.cuentas_claras.backend.repositories.sql.PersonalExpenseRepository;
import com.cuentas_claras.backend.security.JwtUserDetails;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
public class PersonalExpenseService {

    @Autowired
    private PersonalExpenseRepository personalExpenseRepository;

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof JwtUserDetails) {
            // JwtUserDetails.getUserId() devuelve Long, lo convertimos a String
            return ((JwtUserDetails) auth.getPrincipal()).getUserId().toString();
        }
        throw new IllegalStateException("No authenticated user found in context");
    }

    private void validate(PersonalExpenseEntity e) throws IllegalOperationException {
        if (e.getConcept() == null || e.getConcept().trim().isEmpty()) {
            throw new IllegalOperationException("El concepto no puede ser vacío");
        }
        if (e.getTotal() == null || e.getTotal() <= 0) {
            throw new IllegalOperationException("Total inválido");
        }
        if (e.getType() == null) {
            throw new IllegalOperationException("Tipo no puede ser nulo");
        }
        if (e.getDate() == null) {
            throw new IllegalOperationException("La fecha del gasto es requerida");
        }
    }

    @Transactional
    public PersonalExpenseEntity createPersonalExpense(PersonalExpenseEntity expense)
            throws IllegalOperationException {
        String currentUserId = getCurrentUserId();
        log.info("Creando gasto personal para ownerId={}", currentUserId);

        validate(expense);
        expense.setOwnerId(currentUserId);

        return personalExpenseRepository.save(expense);
    }

    @Transactional(readOnly = true)
    public PersonalExpenseEntity getUserExpense(Long expenseId) throws EntityNotFoundException {
        String currentUserId = getCurrentUserId();
        PersonalExpenseEntity existing = personalExpenseRepository.findById(expenseId)
            .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado: " + expenseId));

        if (!Objects.equals(existing.getOwnerId(), currentUserId)) {
            throw new EntityNotFoundException("Gasto no existe para este usuario");
        }
        return existing;
    }

    @Transactional(readOnly = true)
    public List<PersonalExpenseEntity> getUserExpenses() {
        String currentUserId = getCurrentUserId();
        return personalExpenseRepository.findByOwnerId(currentUserId);
    }

    @Transactional(readOnly = true)
    public List<PersonalExpenseEntity> getUserExpensesBetweenDates(Date start, Date end) {
        String currentUserId = getCurrentUserId();

        LocalDate ldStart = start.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate ldEnd   = end.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        return personalExpenseRepository.findByOwnerIdAndDateBetween(currentUserId, ldStart, ldEnd);
    }

    @Transactional(readOnly = true)
    public Float getTotalPersonalExpenses() {
        String currentUserId = getCurrentUserId();
        Double suma = personalExpenseRepository.sumTotalByOwnerId(currentUserId);
        return (suma != null) ? suma.floatValue() : 0f;
    }

    @Transactional
    public PersonalExpenseEntity updatePersonalExpense(Long expenseId, PersonalExpenseEntity updatedExpense)
            throws EntityNotFoundException, IllegalOperationException {

        String currentUserId = getCurrentUserId();
        PersonalExpenseEntity existing = personalExpenseRepository.findById(expenseId)
            .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado: " + expenseId));

        if (!Objects.equals(existing.getOwnerId(), currentUserId)) {
            throw new EntityNotFoundException("Gasto no existe para este usuario");
        }

        validate(updatedExpense);

        updatedExpense.setId(expenseId);
        updatedExpense.setOwnerId(currentUserId);

        return personalExpenseRepository.save(updatedExpense);
    }

    @Transactional
    public void deletePersonalExpense(Long expenseId) throws EntityNotFoundException {
        String currentUserId = getCurrentUserId();
        PersonalExpenseEntity existing = personalExpenseRepository.findById(expenseId)
            .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado: " + expenseId));

        if (!Objects.equals(existing.getOwnerId(), currentUserId)) {
            throw new EntityNotFoundException("Gasto no existe para este usuario");
        }

        personalExpenseRepository.delete(existing);
    }

    @Transactional(readOnly = true)
    public List<PersonalExpenseEntity> getUserExpensesByType(String typeStr) throws EntityNotFoundException {
        String currentUserId = getCurrentUserId();

        ExpenseType type;
        try {
            type = ExpenseType.valueOf(typeStr.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new EntityNotFoundException("Tipo de gasto inválido: " + typeStr);
        }

        List<PersonalExpenseEntity> todosDelTipo = personalExpenseRepository.findByType(type.name());
        return todosDelTipo.stream()
                .filter(e -> Objects.equals(e.getOwnerId(), currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PersonalExpenseEntity> getUserExpensesByConcept(String concept) {
        String currentUserId = getCurrentUserId();

        List<PersonalExpenseEntity> todosConConcepto = personalExpenseRepository.findByConcept(concept);
        return todosConConcepto.stream()
                .filter(e -> Objects.equals(e.getOwnerId(), currentUserId))
                .collect(Collectors.toList());
    }
}
