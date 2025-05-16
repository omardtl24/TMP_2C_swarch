package com.cuentas_claras.backend.controllers;

import java.time.LocalDate;
import java.util.List;

import com.cuentas_claras.backend.dto.PersonalExpenseDetailDTO;
import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.services.PersonalExpenseService;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
public class PersonalExpenseGraphqlController {

  @Autowired private PersonalExpenseService service;
  @Autowired private ModelMapper mapper;

  // —— Queries ——

  @QueryMapping
  public PersonalExpenseDetailDTO getPersonalExpense(@Argument Long id)
      throws EntityNotFoundException {
    var entity = service.getUserExpense(id);
    return mapper.map(entity, PersonalExpenseDetailDTO.class);
  }

  @QueryMapping
  public List<PersonalExpenseDetailDTO> listPersonalExpenses(@Argument Long userId)
      throws EntityNotFoundException {
    var list = service.getUserExpenses(userId);
    return mapper.map(list, new TypeToken<List<PersonalExpenseDetailDTO>>() {}.getType());
  }

  @QueryMapping
  public List<PersonalExpenseDetailDTO> listExpensesBetween(
      @Argument Long userId,
      @Argument @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
      @Argument @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
  ) throws EntityNotFoundException {
    var list = service.getUserExpensesBetweenDates(userId, start, end);
    return mapper.map(list, new TypeToken<List<PersonalExpenseDetailDTO>>() {}.getType());
  }

  @QueryMapping
  public Float totalPersonalExpenses(@Argument Long userId) throws EntityNotFoundException {
    return service.getTotalPersonalExpensesByUserId(userId);
  }


}
