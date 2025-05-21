package com.cuentas_claras.backend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Data
public class NewExpenseInput {
    private Long eventId;
    private double total;
    private String concept;
    private ExpenseType type;
    private List<NewParticipationInput> participation;
    private MultipartFile supportImage;
}