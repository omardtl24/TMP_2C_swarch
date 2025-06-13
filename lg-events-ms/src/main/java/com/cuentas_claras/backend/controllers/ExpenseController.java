package com.cuentas_claras.backend.controllers;

import com.cuentas_claras.backend.dto.ExpenseDTO;
import com.cuentas_claras.backend.dto.ExpenseDetailDTO;
import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.models.sql.ExpenseEntity;
import com.cuentas_claras.backend.services.ExpenseService;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gastos (expenses).
 */
@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private ModelMapper modelMapper;

    /**
     * Crea un nuevo expense asociado a un evento.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExpenseDTO create(@RequestParam Long eventId, @RequestParam String externalDocId)
            throws EntityNotFoundException {
        ExpenseEntity entity = expenseService.createExpense(eventId, externalDocId);
        return modelMapper.map(entity, ExpenseDTO.class);
    }

    /**
     * Obtiene todos los gastos de un evento.
     */
    @GetMapping("/by-event/{eventId}")
    @ResponseStatus(HttpStatus.OK)
    public List<ExpenseDetailDTO> getByEvent(@PathVariable Long eventId)
            throws EntityNotFoundException {
        List<ExpenseEntity> list = expenseService.getExpensesByEvent(eventId);
        return modelMapper.map(list, new TypeToken<List<ExpenseDetailDTO>>(){}.getType());
    }

    /**
     * Obtiene un gasto específico por ID.
     */
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ExpenseDetailDTO getOne(@PathVariable Long id)
            throws EntityNotFoundException {
        ExpenseEntity entity = expenseService.getExpenseDetail(id);
        return modelMapper.map(entity, ExpenseDetailDTO.class);
    }

    /**
     * Elimina un gasto por ID.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id)
            throws EntityNotFoundException {
        expenseService.deleteExpense(id);
    }

    // /**
    //  * Suma total de los gastos asociados a un evento.
    //  */
    // @GetMapping("/sum/by-event/{eventId}")
    // @ResponseStatus(HttpStatus.OK)
    // public Double sumByEvent(@PathVariable Long eventId)
    //         throws EntityNotFoundException {
    //     return expenseService.sumExpensesByEvent(eventId);
    // }

    // /**
    //  * Suma de lo pagado por el usuario autenticado en un evento.
    //  */
    // @GetMapping("/sum/paid-by-me/{eventId}")
    // @ResponseStatus(HttpStatus.OK)
    // public Double sumPaidByMe(@PathVariable Long eventId)
    //         throws EntityNotFoundException {
    //     return expenseService.sumExpensesPaidByUserInEvent(eventId);
    // }

    // /**
    //  * Calcula los balances de los usuarios en un evento.
    //  */
    // @GetMapping("/balances/{eventId}")
    // @ResponseStatus(HttpStatus.OK)
    // public List<Balance> calculateBalances(@PathVariable Long eventId)
    //         throws EntityNotFoundException {
    //     return expenseService.calculateBalances(eventId);
    // }

    // /**
    //  * Suma de todos los gastos registrados en la base de datos SQL.
    //  */
    // @GetMapping("/sum/all")
    // @ResponseStatus(HttpStatus.OK)
    // public Double sumAll() {
    //     return expenseService.sumAllExpenses();
    // }
}
