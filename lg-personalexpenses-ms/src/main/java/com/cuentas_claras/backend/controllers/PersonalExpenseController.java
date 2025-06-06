// src/main/java/com/cuentas_claras/backend/controllers/PersonalExpenseController.java
package com.cuentas_claras.backend.controllers;

import com.cuentas_claras.backend.dto.PersonalExpenseDTO;
import com.cuentas_claras.backend.dto.PersonalExpenseDetailDTO;
import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.IllegalOperationException;
import com.cuentas_claras.backend.models.sql.PersonalExpenseEntity;
import com.cuentas_claras.backend.services.PersonalExpenseService;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/personal-expenses")
public class PersonalExpenseController {

    @Autowired
    private PersonalExpenseService personalExpenseService;

    @Autowired
    private ModelMapper modelMapper;


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PersonalExpenseDTO create(
            @RequestBody PersonalExpenseDTO dto
    ) throws IllegalOperationException {
        PersonalExpenseEntity entity = modelMapper.map(dto, PersonalExpenseEntity.class);
        PersonalExpenseEntity created = personalExpenseService.createPersonalExpense(entity);
        return modelMapper.map(created, PersonalExpenseDTO.class);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<PersonalExpenseDetailDTO> getAllPersonalExpenses() {
        List<PersonalExpenseEntity> list = personalExpenseService.getUserExpenses();
        return modelMapper.map(list, new TypeToken<List<PersonalExpenseDetailDTO>>() {}.getType());
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PersonalExpenseDetailDTO getOnePersonalExpense(@PathVariable("id") Long id) throws EntityNotFoundException {
        PersonalExpenseEntity e = personalExpenseService.getUserExpense(id);
        return modelMapper.map(e, PersonalExpenseDetailDTO.class);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PersonalExpenseDTO update(
            @PathVariable Long id,
            @RequestBody PersonalExpenseDTO dto
    ) throws EntityNotFoundException, IllegalOperationException {
        PersonalExpenseEntity updatedEntity = modelMapper.map(dto, PersonalExpenseEntity.class);
        PersonalExpenseEntity saved = personalExpenseService.updatePersonalExpense(id, updatedEntity);
        return modelMapper.map(saved, PersonalExpenseDTO.class);
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) throws EntityNotFoundException {
        personalExpenseService.deletePersonalExpense(id);
    }


    @GetMapping("/sum/all")
    @ResponseStatus(HttpStatus.OK)
    public Float sumTotalMe() {
        return personalExpenseService.getTotalPersonalExpenses();
    }


    @GetMapping("/search/type")
    @ResponseStatus(HttpStatus.OK)
    public List<PersonalExpenseDetailDTO> searchByType(@RequestParam String type) throws EntityNotFoundException {
        List<PersonalExpenseEntity> list = personalExpenseService.getUserExpensesByType(type);
        return modelMapper.map(list, new TypeToken<List<PersonalExpenseDetailDTO>>() {}.getType());
    }


    @GetMapping("/search/concept")
    @ResponseStatus(HttpStatus.OK)
    public List<PersonalExpenseDetailDTO> searchByConcept(@RequestParam String concept) {
        List<PersonalExpenseEntity> list = personalExpenseService.getUserExpensesByConcept(concept);
        return modelMapper.map(list, new TypeToken<List<PersonalExpenseDetailDTO>>() {}.getType());
    }


    @GetMapping("/all/between")
    @ResponseStatus(HttpStatus.OK)
    public List<PersonalExpenseDetailDTO> getBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date start,
            @RequestParam   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date end
    ) {
        List<PersonalExpenseEntity> list = personalExpenseService.getUserExpensesBetweenDates(start, end);
        return modelMapper.map(list, new TypeToken<List<PersonalExpenseDetailDTO>>() {}.getType());
    }
}
