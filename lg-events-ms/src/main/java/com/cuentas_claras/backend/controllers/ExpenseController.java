package com.cuentas_claras.backend.controllers;

import com.cuentas_claras.backend.dto.Balance;
import com.cuentas_claras.backend.dto.DeleteExpenseInput;
import com.cuentas_claras.backend.dto.NewExpenseInput;
import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.models.sql.ExpenseEntity;
import com.cuentas_claras.backend.services.ExpenseService;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    /**
     * obtener todos los gastos SQL de un evento.
     */
    @QueryMapping
    public List<ExpenseEntity> expensesByEvent(@Argument("eventId") Long eventId)
            throws EntityNotFoundException {
        return expenseService.getExpensesByEvent(eventId);
    }

    /**
     * obtener el detalle de un gasto SQL por ID.
     */
    @QueryMapping
    public ExpenseEntity expenseDetail(@Argument("expenseId") Long expenseId)
            throws EntityNotFoundException {
        return expenseService.getExpenseDetail(expenseId);
    }

    /**
     *  sumar todos los gastos de un evento (total desde Mongo para cada externalDocId).
     */
    @QueryMapping
    public Double sumExpensesByEvent(@Argument("eventId") Long eventId)
            throws EntityNotFoundException {
        return expenseService.sumExpensesByEvent(eventId);
    }

    /**
     * sumar todos los gastos que el usuario autenticado pagó en un evento.
     */
    @QueryMapping
    public Double sumExpensesPaidByUserInEvent(@Argument("eventId") Long eventId)
            throws EntityNotFoundException {
        return expenseService.sumExpensesPaidByUserInEvent(eventId);
    }

    /**
     * Calcular balances por usuario en un evento.
     */
    @QueryMapping
    public List<Balance> calculateBalances(@Argument("eventId") Long eventId)
            throws EntityNotFoundException {
        return expenseService.calculateBalances(eventId);
    }

    /**
     * Sumar todos los gastos globales (de todos los eventos).
     */
    @QueryMapping
    public Double sumAllExpenses() {
        return expenseService.sumAllExpenses();
    }

    @MutationMapping
    public ExpenseEntity createExpense(@Argument("input") NewExpenseInput input)
            throws EntityNotFoundException {
        return expenseService.createExpense(input.getEventId(), input.getExternalDocId());
    }

    @MutationMapping
    public Boolean deleteExpense(@Argument("input") DeleteExpenseInput input)
            throws EntityNotFoundException {
        expenseService.deleteExpense(input.getExpenseId());
        return true;
    }
}
