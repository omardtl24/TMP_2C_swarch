package com.cuentas_claras.backend.dto;

import java.util.Date;
import lombok.Data;


@Data
public class PersonalExpenseDetailDTO {
    private Long id;
    private String concept;
    private Long owner;
    private String type;
    private Float total;
    private Date date;
}
