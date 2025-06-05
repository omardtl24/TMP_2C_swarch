package com.cuentas_claras.backend.controllers;

import com.cuentas_claras.backend.dto.Balance;
import com.cuentas_claras.backend.dto.DeleteExpenseInput;
import com.cuentas_claras.backend.dto.NewExpenseInput;
import com.cuentas_claras.backend.dto.UpdateExpenseInput;
import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.IllegalOperationException;
import com.cuentas_claras.backend.models.enums.ExpenseType;
import com.cuentas_claras.backend.models.mongo.ExpenseDocument;
import com.cuentas_claras.backend.models.sql.ExpenseEntity;
import com.cuentas_claras.backend.repositories.mongo.ExpenseDocumentRepository;
import com.cuentas_claras.backend.services.ExpenseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private ExpenseDocumentRepository expenseDocumentRepository;

    @SchemaMapping(typeName = "ExpenseEntity", field = "document")
    public ExpenseDocument document(ExpenseEntity expense) throws EntityNotFoundException {
        return expenseDocumentRepository.findById(expense.getExternalDocId())
        .orElseThrow(() -> new EntityNotFoundException(
            "Documento no encontrado: " + expense.getExternalDocId()
        ));
    }

    @QueryMapping
    public List<ExpenseEntity> expensesByEvent(@Argument("eventId") Long eventId) throws Exception {
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
    public List<ExpenseDocument> searchExpensesByType(@Argument("type") ExpenseType type) {
        return expenseService.searchByType(type.name());
    }

    @QueryMapping
    public List<ExpenseDocument> searchExpensesByConcept(@Argument("keyword") String keyword) {
        return expenseService.searchByConcept(keyword);
    }

    @QueryMapping
    public Double sumAllExpenses() {
        return expenseService.sumAllExpenses();
    }

    @QueryMapping
    public List<Balance> calcularBalances(@Argument Long eventId) throws EntityNotFoundException {
        Map<String, Double> balances = expenseService.calculateBalances(eventId);
      
        return balances.entrySet().stream()
        .map(e -> new Balance(e.getKey(), e.getValue()))
        .collect(Collectors.toList());
    }


    @QueryMapping
    public ExpenseEntity expenseDetail(@Argument("expenseId") Long expenseId)
            throws EntityNotFoundException {
        return expenseService.getExpenseDetail(expenseId);
    }


    @MutationMapping
    public ExpenseDocument createExpense(
        @Argument("input") NewExpenseInput input,
        @Argument("supportImage") MultipartFile supportImage
    ) throws Exception {
        return expenseService.createExpense(
            // input.getEventId(),
            input.getTotal(),
            input.getConcept(),
            input.getType().name(),
            input.getParticipation(),
            supportImage
        );
    }

    @MutationMapping
    public ExpenseDocument updateExpense(
        @Argument("input") UpdateExpenseInput input,
        @Argument("supportImage") MultipartFile supportImage
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
    public Boolean deleteExpense(@Argument("input") DeleteExpenseInput input)
            throws EntityNotFoundException, IllegalOperationException {
        expenseService.deleteExpense(input.getExpenseId());
        return true;
    }

    @MutationMapping
    public String uploadSupportImage(
        @Argument("eventId") String eventId,
        @Argument("expenseId") String expenseId,
        @Argument("file") MultipartFile file
    ) throws Exception {
        return expenseService.saveSupportImage(eventId, expenseId, file);
    }

    @QueryMapping
    public Double sumExpensesByEvent(@Argument Long eventId) throws EntityNotFoundException {
        return expenseService.sumExpensesByEvent(eventId);
    }

    @QueryMapping
    public Double sumExpensesPaidByUserInEvent(@Argument Long eventId)
        throws EntityNotFoundException {
        return expenseService.sumExpensesPaidByUserInEvent(eventId);
    }


}
