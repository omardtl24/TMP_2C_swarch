package com.cuentas_claras.backend.controllers;

import java.time.LocalDate;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.cuentas_claras.backend.dto.PersonalExpenseDTO;
import com.cuentas_claras.backend.dto.PersonalExpenseDetailDTO;
import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.IllegalOperationException;
import com.cuentas_claras.backend.models.sql.PersonalExpenseEntity;
import com.cuentas_claras.backend.services.PersonalExpenseService;

@RestController
@RequestMapping("/personal-expenses")
public class PersonalExpenseRESTController {

    @Autowired
    private PersonalExpenseService service;

    @Autowired
    private ModelMapper modelMapper;

    /**
     * Crea un nuevo gasto personal.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PersonalExpenseDTO create(
            @RequestBody PersonalExpenseDTO dto) throws EntityNotFoundException, IllegalOperationException {
        PersonalExpenseEntity entity = modelMapper.map(dto, PersonalExpenseEntity.class);
        PersonalExpenseEntity created = service.createPersonalExpense(entity);
        return modelMapper.map(created, PersonalExpenseDTO.class);
    }

    /**
     * Recupera un gasto personal por su ID.
     */
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PersonalExpenseDetailDTO getOne(@PathVariable Long id) throws EntityNotFoundException {
        PersonalExpenseEntity entity = service.getUserExpense(id);
        return modelMapper.map(entity, PersonalExpenseDetailDTO.class);
    }

    /**
     * Recupera todos los gastos personales de un usuario.
     */
    @GetMapping("/user/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public List<PersonalExpenseDetailDTO> getAll(
            @PathVariable Long userId) throws EntityNotFoundException {
        List<PersonalExpenseEntity> list = service.getUserExpenses(userId);
        return modelMapper.map(list, new TypeToken<List<PersonalExpenseDetailDTO>>() {}.getType());
    }

    /**
     * Recupera gastos personales de un usuario entre dos fechas.
     */
    @GetMapping("/user/{userId}/between")
    @ResponseStatus(HttpStatus.OK)
    public List<PersonalExpenseDetailDTO> getBetween(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) throws EntityNotFoundException {
        List<PersonalExpenseEntity> list = service.getUserExpensesBetweenDates(userId, start, end);
        return modelMapper.map(list, new TypeToken<List<PersonalExpenseDetailDTO>>() {}.getType());
    }

    /**
     * Actualiza un gasto personal existente.
     */
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PersonalExpenseDTO update(
            @PathVariable Long id,
            @RequestBody PersonalExpenseDTO dto) throws EntityNotFoundException, IllegalOperationException {
        PersonalExpenseEntity updated = modelMapper.map(dto, PersonalExpenseEntity.class);
        PersonalExpenseEntity saved = service.updatePersonalExpense(id, updated);
        return modelMapper.map(saved, PersonalExpenseDTO.class);
    }

    /**
     * Borra un gasto personal.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) throws EntityNotFoundException {
        service.deletePersonalExpense(id);
    }
}
