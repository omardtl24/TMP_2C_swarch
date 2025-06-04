package com.cuentas_claras.backend.services;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.transaction.Transactional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

import com.cuentas_claras.backend.config.UserManagerConfig;
import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.IllegalOperationException;
import com.cuentas_claras.backend.models.enums.ExpenseType;
import com.cuentas_claras.backend.models.sql.PersonalExpenseEntity;
import com.cuentas_claras.backend.repositories.sql.PersonalExpenseRepository;

import uk.co.jemos.podam.api.PodamFactory;
import uk.co.jemos.podam.api.PodamFactoryImpl;

@DataJpaTest
@Transactional
@Import(PersonalExpenseService.class)
class PersonalExpenseServiceTest {

    @Autowired
    private PersonalExpenseService service;

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private PersonalExpenseRepository repository;

    private PodamFactory factory = new PodamFactoryImpl();

    private List<PersonalExpenseEntity> expensesList = new ArrayList<>();

    @BeforeEach
    void setUp() {
        clearData();
        insertData();
    }

    private void clearData() {
        entityManager.getEntityManager().createQuery("DELETE FROM PersonalExpenseEntity").executeUpdate();
    }

    private void insertData() {
        for (int i = 0; i < 3; i++) {
            PersonalExpenseEntity entity = factory.manufacturePojo(PersonalExpenseEntity.class);
            entity.setOwner(1L); // Simulamos usuario existente
            entity.setTotal(100f);
            entity.setType(ExpenseType.COMIDA_Y_BEBIDA);
            entity.setDate(new Date());
            entityManager.persist(entity);
            expensesList.add(entity);
        }
    }

    @Test
    void testCreateValidExpense() throws Exception {
        PersonalExpenseEntity newExpense = factory.manufacturePojo(PersonalExpenseEntity.class);
        newExpense.setOwner(1L);
        newExpense.setTotal(200f);
        newExpense.setType(ExpenseType.TRANSPORTE);
        newExpense.setDate(new Date());

        PersonalExpenseEntity result = service.createPersonalExpense(newExpense);
        assertNotNull(result);
        assertEquals(newExpense.getConcept(), result.getConcept());
    }

    @Test
    void testCreateInvalidExpense_EmptyConcept() {
        PersonalExpenseEntity invalid = factory.manufacturePojo(PersonalExpenseEntity.class);
        invalid.setConcept(" ");
        invalid.setTotal(100f);
        invalid.setType(ExpenseType.HOGAR);
        invalid.setDate(new Date());
        invalid.setOwner(1L);
        assertThrows(IllegalOperationException.class, () -> service.createPersonalExpense(invalid));
    }

    @Test
    void testGetUserExpense() throws Exception {
        PersonalExpenseEntity existing = expensesList.get(0);
        PersonalExpenseEntity found = service.getUserExpense(existing.getId());
        assertEquals(existing.getId(), found.getId());
    }

    @Test
    void testGetInvalidExpense() {
        assertThrows(EntityNotFoundException.class, () -> service.getUserExpense(0L));
    }

    @Test
    void testUpdateExpense() throws Exception {
        PersonalExpenseEntity existing = expensesList.get(0);
        PersonalExpenseEntity updated = factory.manufacturePojo(PersonalExpenseEntity.class);
        updated.setOwner(existing.getOwner()); // owner stays the same
        updated.setType(ExpenseType.COMPRAS);
        updated.setTotal(500f);
        updated.setDate(new Date());

        PersonalExpenseEntity result = service.updatePersonalExpense(existing.getId(), updated);
        assertEquals(updated.getTotal(), result.getTotal());
        assertEquals(updated.getType(), result.getType());
    }

    @Test
    void testDeleteExpense() throws Exception {
        PersonalExpenseEntity entity = expensesList.get(0);
        service.deletePersonalExpense(entity.getId());
        assertNull(entityManager.find(PersonalExpenseEntity.class, entity.getId()));
    }

    @Test
    void testGetExpensesByUser() throws Exception {
        List<PersonalExpenseEntity> list = service.getUserExpenses(1L);
        assertEquals(3, list.size());
    }

    @Test
    void testGetExpensesBetweenDates() throws Exception {
        LocalDate today = LocalDate.now();
        List<PersonalExpenseEntity> list = service.getUserExpensesBetweenDates(1L, today.minusDays(1), today.plusDays(1));
        assertFalse(list.isEmpty());
    }

    @Test
    void testSumExpensesForUser() throws Exception {
        Float total = service.getTotalPersonalExpensesByUserId(1L);
        assertTrue(total > 0);
    }
}
