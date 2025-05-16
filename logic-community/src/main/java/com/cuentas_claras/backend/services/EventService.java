package com.cuentas_claras.backend.services;

import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.IllegalOperationException;
import com.cuentas_claras.backend.models.sql.EventEntity;
import com.cuentas_claras.backend.repositories.sql.EventRepository;
import com.cuentas_claras.backend.models.UserCache;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Slf4j
@Service
public class EventService {

    private static final int MIN_LENGTH = 3;
    private static final int MAX_LENGTH = 60;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserCache userCache;

    @Transactional
    public EventEntity createEvent(EventEntity event) throws IllegalOperationException {
        String creatorId = userCache.getUserId();
        log.info("Creando evento para usuario {}", creatorId);

        validateEvent(event);
        event.setCreatorId(creatorId);
        event.setInvitationEnabled(false);
        EventEntity saved = eventRepository.save(event);
        log.info("Evento {} creado", saved.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<EventEntity> getEventsByCreator(String creatorId) {
        log.info("Listando eventos creados por {}", creatorId);
        return eventRepository.findByCreatorId(creatorId);
    }

    @Transactional(readOnly = true)
    public EventEntity getEvent(Long eventId) throws EntityNotFoundException {
        log.info("Consultando evento {}", eventId);
        return eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));
    }

    @Transactional
    public EventEntity updateEvent(Long eventId, EventEntity updated) throws EntityNotFoundException, IllegalOperationException {
        log.info("Actualizando evento {}", eventId);

        EventEntity existing = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));

        validateEvent(updated);

        updated.setId(eventId);
        updated.setCreatorId(existing.getCreatorId());
        updated.setInvitationEnabled(existing.isInvitationEnabled());

        EventEntity saved = eventRepository.save(updated);
        log.info("Evento {} actualizado", saved.getId());
        return saved;
    }

    @Transactional
    public void deleteEvent(Long eventId) throws EntityNotFoundException {
        log.info("Eliminando evento {}", eventId);
        if (!eventRepository.existsById(eventId)) {
            throw new EntityNotFoundException("Evento no encontrado: " + eventId);
        }
        eventRepository.deleteById(eventId);
    }

    @Transactional
    public EventEntity setInvitationEnabled(Long eventId, boolean enabled) throws EntityNotFoundException, IllegalOperationException {
        String userId = userCache.getUserId();
        log.info("{} invitaciones para evento {}", enabled ? "Habilitando" : "Deshabilitando", eventId);

        EventEntity event = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));

        if (!event.getCreatorId().equals(userId)) {
            throw new IllegalOperationException("Solo el creador puede cambiar la invitación");
        }

        event.setInvitationEnabled(enabled);
        EventEntity saved = eventRepository.save(event);
        log.info("Invitaciones {} para evento {}", enabled ? "habilitadas" : "deshabilitadas", eventId);
        return saved;
    }

    private void validateEvent(EventEntity event) throws IllegalOperationException {
        if (event.getName() == null || event.getName().trim().isEmpty()) {
            throw new IllegalOperationException("El nombre del evento no puede estar vacío");
        }
        if (event.getName().length() < MIN_LENGTH || event.getName().length() > MAX_LENGTH) {
            throw new IllegalOperationException("El nombre debe tener entre " + MIN_LENGTH + " y " + MAX_LENGTH + " caracteres");
        }
        if (event.getDescription() == null || event.getDescription().trim().isEmpty()) {
            throw new IllegalOperationException("La descripción no puede estar vacía");
        }
        Date begin = event.getBeginDate();
        Date end = event.getEndDate();
        if (begin == null || end == null) {
            throw new IllegalOperationException("Las fechas de inicio y fin deben estar definidas");
        }
        if (end.before(begin)) {
            throw new IllegalOperationException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }
    }
}
