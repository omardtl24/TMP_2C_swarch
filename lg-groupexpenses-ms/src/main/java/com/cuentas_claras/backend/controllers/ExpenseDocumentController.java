package com.cuentas_claras.backend.controllers;

import com.cuentas_claras.backend.dto.DeleteExpenseDocumentInput;
import com.cuentas_claras.backend.dto.NewExpenseDocumentInput;
import com.cuentas_claras.backend.dto.UpdateExpenseDocumentInput;
import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.models.mongo.ExpenseDocument;
import com.cuentas_claras.backend.models.mongo.ExpenseDocument.Participation;
import com.cuentas_claras.backend.services.ExpenseDocumentService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class ExpenseDocumentController {

    private final ExpenseDocumentService expenseDocumentService;

    @QueryMapping
    public ExpenseDocument expenseDocumentById(@Argument("documentId") String documentId) throws EntityNotFoundException {
        return expenseDocumentService.getExpenseDocumentById(documentId);
    }

    @QueryMapping
    public List<ExpenseDocument> expensesPaidByMe() {
        return expenseDocumentService.getExpensesPaidByMe();
    }

    @QueryMapping
    public List<ExpenseDocument> expensesParticipatedByMe() {
        return expenseDocumentService.getExpensesParticipatedByMe();
    }

    @QueryMapping
    public List<ExpenseDocument> searchExpenseDocumentsByType(@Argument("type") String type) {
        return expenseDocumentService.searchByType(type);
    }

    @QueryMapping
    public List<ExpenseDocument> searchExpenseDocumentsByConcept(@Argument("keyword") String keyword) {
        return expenseDocumentService.searchByConcept(keyword);
    }


    @MutationMapping
    public ExpenseDocument createExpenseDocument(
            @Argument("input") NewExpenseDocumentInput input
    ) {
        MultipartFile supportImage = input.getSupportImage();
        ObjectId imageId = null;
        if (supportImage != null && !supportImage.isEmpty()) {
            imageId = expenseDocumentService.saveSupportImage(supportImage);
        }

        List<Participation> participationList = input.getParticipation().stream()
            .map(dto -> {
                Participation p = new Participation();
                p.setUserId(dto.getUserId());
                p.setState(dto.getState());
                p.setPortion(dto.getPortion());
                return p;
            })
            .collect(Collectors.toList());

        return expenseDocumentService.createExpenseDocument(
                input.getTotal(),
                input.getConcept(),
                input.getType().name(),
                participationList,
                imageId
        );
    }

    @MutationMapping
    public ExpenseDocument updateExpenseDocument(
            @Argument("input") UpdateExpenseDocumentInput input
    ) throws EntityNotFoundException {
        MultipartFile supportImage = input.getSupportImage();
        ObjectId imageId = null;
        if (supportImage != null && !supportImage.isEmpty()) {
            imageId = expenseDocumentService.saveSupportImage(supportImage);
        }

        List<Participation> participationList = input.getParticipation().stream()
            .map(dto -> {
                Participation p = new Participation();
                p.setUserId(dto.getUserId());
                p.setState(dto.getState());
                p.setPortion(dto.getPortion());
                return p;
            })
            .collect(Collectors.toList());

        return expenseDocumentService.updateExpenseDocument(
                input.getDocumentId(),
                input.getTotal(),
                input.getConcept(),
                input.getType().name(),
                participationList,
                imageId
        );
    }

    @MutationMapping
    public Boolean deleteExpenseDocument(@Argument("input") DeleteExpenseDocumentInput input) throws EntityNotFoundException {
        expenseDocumentService.deleteExpenseDocument(input.getDocumentId());
        return true;
    }
}
