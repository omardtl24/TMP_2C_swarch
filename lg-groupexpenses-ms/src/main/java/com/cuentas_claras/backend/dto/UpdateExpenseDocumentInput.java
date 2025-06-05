package com.cuentas_claras.backend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import com.cuentas_claras.backend.models.enums.ExpenseType;

import java.util.List;

@Data
public class UpdateExpenseDocumentInput {
    private String documentId;
    private double total;
    private String concept;
    private ExpenseType type;
    private List<NewParticipationInput> participation;
    private MultipartFile supportImage;
}