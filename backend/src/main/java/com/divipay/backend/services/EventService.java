package com.divipay.backend.services;

import java.util.List;
import java.util.Optional;

import com.divipay.backend.exceptions.EntityNotFoundException;
import com.divipay.backend.exceptions.IllegalOperationException;
import com.divipay.backend.models.sql.EventEntity;
import com.divipay.backend.models.sql.UserEntity;
import com.divipay.backend.repositories.sql.EventRepository;
import com.divipay.backend.repositories.sql.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    private static final int MIN_CHAR = 3;
    private static final int MAX_CHAR = 100;

    @Transactional
    public EventEntity createEvent(Long userId, EventEntity eventEntity)
            throws EntityNotFoundException, IllegalOperationException {

        log.info("Inicia creación de evento");

        Optional<UserEntity> userEntity = userRepository.findById(userId);
        if (userEntity.isEmpty()) {
            throw new EntityNotFoundException("Usuario no encontrado con id: " + userId);
        }

        validarEvento(eventEntity);

        eventEntity.setCreator(userEntity.get());
        log.info("Finaliza creación de evento");
        return eventRepository.save(eventEntity);
    }

    @Transactional
    public List<EventEntity> getAllEvents() {
        return eventRepository.findAll();
    }

    @Transactional
    public EventEntity getEvent(Long eventId) throws EntityNotFoundException {
        Optional<EventEntity> event = eventRepository.findById(eventId);
        if (event.isEmpty()) {
            throw new EntityNotFoundException("Evento no encontrado con id: " + eventId);
        }
        return event.get();
    }

    @Transactional
    public EventEntity updateEvent(Long eventId, EventEntity updatedEvent)
            throws EntityNotFoundException, IllegalOperationException {

        Optional<EventEntity> existing = eventRepository.findById(eventId);
        if (existing.isEmpty()) {
            throw new EntityNotFoundException("Evento no encontrado con id: " + eventId);
        }

        validarEvento(updatedEvent);
        updatedEvent.setId(eventId);
        updatedEvent.setCreator(existing.get().getCreator());
        return eventRepository.save(updatedEvent);
    }

    @Transactional
    public void deleteEvent(Long eventId) throws EntityNotFoundException {
        Optional<EventEntity> event = eventRepository.findById(eventId);
        if (event.isEmpty()) {
            throw new EntityNotFoundException("Evento no encontrado con id: " + eventId);
        }
        eventRepository.deleteById(eventId);
    }

    private void validarEvento(EventEntity event) throws IllegalOperationException {
        if (event.getName() == null || event.getName().isBlank()) {
            throw new IllegalOperationException("El nombre del evento no puede estar vacío.");
        }
        if (event.getName().length() < MIN_CHAR || event.getName().length() > MAX_CHAR) {
            throw new IllegalOperationException("El nombre del evento debe tener entre " + MIN_CHAR + " y " + MAX_CHAR + " caracteres.");
        }
        if (event.getDescription() == null || event.getDescription().isBlank()) {
            throw new IllegalOperationException("La descripción del evento no puede estar vacía.");
        }
        if (event.getBeginDate() == null || event.getEndDate() == null) {
            throw new IllegalOperationException("Las fechas del evento no pueden ser nulas.");
        }
        if (event.getEndDate().before(event.getBeginDate())) {
            throw new IllegalOperationException("La fecha final no puede ser anterior a la fecha inicial.");
        }
    }
}
