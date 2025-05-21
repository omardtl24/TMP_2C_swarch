package com.cuentas_claras.backend.controllers;

import com.cuentas_claras.backend.models.mongo.ExpenseDocument;
import com.cuentas_claras.backend.models.sql.ExpenseEntity;
import com.cuentas_claras.backend.services.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @QueryMapping
    public List<ExpenseEntity> expensesByEvent(@Argument Long eventId) throws Exception {
        return expenseService.getExpensesByEvent(eventId);
    }

    @QueryMapping
    public List<ExpenseDocument> expensesPaidByMe() {
        return expenseService.getExpensesPaidByMe();
    }

    @QueryMapping
    public List<ExpenseDocument> expensesParticipatedByMe() {
        return expenseService.getExpensesParticipatedByMe();
    }

    @QueryMapping
    public List<ExpenseDocument> searchExpensesByType(@Argument ExpenseType type) {
        return expenseService.searchByType(type.name());
    }

    @QueryMapping
    public List<ExpenseDocument> searchExpensesByConcept(@Argument String keyword) {
        return expenseService.searchByConcept(keyword);
    }

    @QueryMapping
    public Double sumAllExpenses() {
        return expenseService.sumAllExpenses();
    }

    @MutationMapping
    public ExpenseEntity createExpense(
        @Argument NewExpenseInput input,
        @Argument MultipartFile supportImage
    ) throws Exception {
        return expenseService.createExpense(
            input.getEventId(),
            input.getTotal(),
            input.getConcept(),
            input.getType().name(),
            input.getParticipation(),
            supportImage
        );
    }

    @MutationMapping
    public ExpenseDocument updateExpense(
        @Argument UpdateExpenseInput input,
        @Argument MultipartFile supportImage
    ) throws Exception {
        return expenseService.updateExpense(
            input.getExpenseId(),
            input.getTotal(),
            input.getConcept(),
            input.getType().name(),
            input.getParticipation(),
            supportImage
        );
    }

    @MutationMapping
    public Boolean deleteExpense(@Argument DeleteExpenseInput input) {
        expenseService.deleteExpense(input.getExpenseId());
        return true;
    }

    @MutationMapping
    public String uploadSupportImage(
        @Argument String eventId,
        @Argument String expenseId,
        @Argument MultipartFile file
    ) throws Exception {
        return expenseService.saveSupportImage(eventId, expenseId, file);
    }
}