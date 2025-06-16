package com.cuentas_claras.backend.dto;

import java.util.Date;
import lombok.Data;


@Data
public class PersonalExpenseDTO {
    private Long id;
    private String concept;
    private String type;
    private Float total;
    private Date date;
}
