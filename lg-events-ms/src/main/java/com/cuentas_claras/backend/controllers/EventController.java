package com.cuentas_claras.backend.controllers;


import com.cuentas_claras.backend.dto.EventDTO;
import com.cuentas_claras.backend.dto.EventDetailDTO;
import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.IllegalOperationException;
import com.cuentas_claras.backend.models.sql.EventEntity;
import com.cuentas_claras.backend.services.EventService;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

/**
 * Controlador REST para eventos.
 */
@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private ModelMapper modelMapper;

    /**
     * Crea un nuevo evento.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventDTO create(@RequestBody EventDTO dto) throws IllegalOperationException {
        EventEntity entity = modelMapper.map(dto, EventEntity.class);
        EventEntity created = eventService.createEvent(entity);
        return modelMapper.map(created, EventDTO.class);
    }

        /**
         * Lista todos los eventos creados por el usuario autenticado.
         */
        @GetMapping("/me")
        @ResponseStatus(HttpStatus.OK)
        public List<EventDetailDTO> getMyEvents() {
            List<EventEntity> list = eventService.getMyEvents();
            return modelMapper.map(list, new TypeToken<List<EventDetailDTO>>(){}.getType());
        }

    /**
     * Obtiene un evento por ID.
     */
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public EventDetailDTO getOne(@PathVariable("id") Long id) throws EntityNotFoundException {
        EventEntity e = eventService.getEvent(id);
        return modelMapper.map(e, EventDetailDTO.class);
    }

    /**
     * Busca eventos por nombre parcial.
     */
    @GetMapping("/search")
    @ResponseStatus(HttpStatus.OK)
    public List<EventDetailDTO> searchByName(@RequestParam("q") String name) {
        List<EventEntity> list = eventService.searchByName(name);
        return modelMapper.map(list, new TypeToken<List<EventDetailDTO>>(){}.getType());
    }

    /**
     * Lista eventos futuros a partir de la fecha dada.
     */
    @GetMapping("/upcoming")
    @ResponseStatus(HttpStatus.OK)
    public List<EventDetailDTO> getUpcoming(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from) {
        List<EventEntity> list = eventService.getUpcomingEvents(from);
        return modelMapper.map(list, new TypeToken<List<EventDetailDTO>>(){}.getType());
    }

    /**
     * Busca eventos en un rango de fechas.
     */
    @GetMapping("/between")
    @ResponseStatus(HttpStatus.OK)
    public List<EventDetailDTO> getBetween(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date start,
            @RequestParam("end")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date end) {
        List<EventEntity> list = eventService.getEventsBetween(start, end);
        return modelMapper.map(list, new TypeToken<List<EventDetailDTO>>(){}.getType());
    }

    /**
     * Habilita o deshabilita invitaciones de un evento.
     */
    @PatchMapping("/{id}/invite")
    @ResponseStatus(HttpStatus.OK)
    public EventDetailDTO setInvite(
            @PathVariable("id") Long id,
            @RequestParam("enabled") boolean enabled)
            throws EntityNotFoundException, IllegalOperationException {
        EventEntity updated = eventService.setInvitationEnabled(id, enabled);
        return modelMapper.map(updated, EventDetailDTO.class);
    }

    /**
     * Elimina un evento.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) throws EntityNotFoundException, IllegalOperationException {
        eventService.deleteEvent(id);
    }
}