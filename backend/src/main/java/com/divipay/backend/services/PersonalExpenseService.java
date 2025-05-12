package com.divipay.backend.services;

import java.util.List;
import java.util.Optional;

import com.divipay.backend.exceptions.EntityNotFoundException;
import com.divipay.backend.exceptions.IllegalOperationException;
import com.divipay.backend.models.sql.PersonalExpenseEntity;
import com.divipay.backend.models.sql.UserEntity;
import com.divipay.backend.repositories.sql.PersonalExpenseRepository;
import com.divipay.backend.repositories.sql.UserRepository;

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

    private static final int MIN_CHAR = 3;
    private static final int MAX_CHAR = 100;

    @Transactional
    public PersonalExpenseEntity createPersonalExpense(Long userId, PersonalExpenseEntity expense)
            throws EntityNotFoundException, IllegalOperationException {

        log.info("Inicia creación de gasto personal");

        Optional<UserEntity> userEntity = userRepository.findById(userId);
        if (userEntity.isEmpty()) {
            throw new EntityNotFoundException("Usuario no encontrado con id: " + userId);
        }

        validarGasto(expense);

        expense.setOwner(userEntity.get());  // Use 'owner' instead of 'user'
        return personalExpenseRepository.save(expense);
    }

    @Transactional
    public List<PersonalExpenseEntity> getAllByUser(Long userId) throws EntityNotFoundException {
        Optional<UserEntity> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new EntityNotFoundException("Usuario no encontrado con id: " + userId);
        }

        return user.get().getPersonalExpenses();  // Assuming this method exists in UserEntity
    }

    @Transactional
    public PersonalExpenseEntity getPersonalExpense(Long userId, Long expenseId) throws EntityNotFoundException {
        Optional<PersonalExpenseEntity> expense = personalExpenseRepository.findById(expenseId);
        if (expense.isEmpty() || !expense.get().getOwner().getId().equals(userId)) {  // Use 'getOwner()'
            throw new EntityNotFoundException("Gasto personal no encontrado o no pertenece al usuario.");
        }
        return expense.get();
    }

    @Transactional
    public PersonalExpenseEntity updatePersonalExpense(Long userId, Long expenseId, PersonalExpenseEntity updatedExpense)
            throws EntityNotFoundException, IllegalOperationException {

        Optional<PersonalExpenseEntity> existing = personalExpenseRepository.findById(expenseId);
        if (existing.isEmpty() || !existing.get().getOwner().getId().equals(userId)) {  // Use 'getOwner()'
            throw new EntityNotFoundException("Gasto personal no encontrado o no pertenece al usuario.");
        }

        validarGasto(updatedExpense);
        updatedExpense.setId(expenseId);
        updatedExpense.setOwner(existing.get().getOwner());  // Use 'setOwner()'

        return personalExpenseRepository.save(updatedExpense);
    }

    @Transactional
    public void deletePersonalExpense(Long userId, Long expenseId) throws EntityNotFoundException {
        Optional<PersonalExpenseEntity> expense = personalExpenseRepository.findById(expenseId);
        if (expense.isEmpty() || !expense.get().getOwner().getId().equals(userId)) {  // Use 'getOwner()'
            throw new EntityNotFoundException("Gasto personal no encontrado o no pertenece al usuario.");
        }
        personalExpenseRepository.deleteById(expenseId);
    }

    private void validarGasto(PersonalExpenseEntity expense) throws IllegalOperationException {
        if (expense.getConcept() == null || expense.getConcept().isBlank()) {
            throw new IllegalOperationException("El concepto del gasto no puede estar vacío.");
        }

        if (expense.getConcept().length() < MIN_CHAR || expense.getConcept().length() > MAX_CHAR) {
            throw new IllegalOperationException("El concepto debe tener entre " + MIN_CHAR + " y " + MAX_CHAR + " caracteres.");
        }

        if (expense.getType() == null || expense.getType().isBlank()) {
            throw new IllegalOperationException("El tipo del gasto no puede estar vacío.");
        }

        if (expense.getTotal() <= 0) {
            throw new IllegalOperationException("El monto total debe ser mayor a 0.");
        }
    }
}
