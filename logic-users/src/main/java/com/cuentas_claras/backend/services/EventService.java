package com.cuentas_claras.backend.services;

import java.util.Date;
import java.util.List;

import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.IllegalOperationException;
import com.cuentas_claras.backend.models.sql.EventEntity;
import com.cuentas_claras.backend.models.sql.UserEntity;
import com.cuentas_claras.backend.repositories.sql.EventRepository;
import com.cuentas_claras.backend.repositories.sql.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;


/* 

El siguiente servicio implementa:

createEvent: crea y asocia el evento al usuario creador; inicializa invitationEnabled = false.

getEventsByCreator: lista eventos por creador.

getEvent: obtiene un evento por su ID.

updateEvent: actualiza datos del evento sin alterar creador ni invitaciones.

deleteEvent: elimina el evento si existe.

setInvitationEnabled: habilita o deshabilita el uso del código de invitación, validando que sólo el creador pueda hacerlo. */

@Slf4j
@Service
public class EventService {

    private static final int MIN_LENGTH = 3;
    private static final int MAX_LENGTH = 60;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Crea un nuevo evento y lo asocia al usuario creador.
     * @throws EntityNotFoundException 
     * @throws IllegalOperationException 
     */
    @Transactional
    public EventEntity createEvent(Long creatorId, EventEntity event) throws EntityNotFoundException, IllegalOperationException {
        log.info("Iniciando creación de evento para usuario {}", creatorId);

        // Verificar usuario
        UserEntity creator = userRepository.findById(creatorId)
            .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + creatorId));

        // Validar datos del evento
        validateEvent(event);

        // Asociar creador e inicializar invitaciones deshabilitadas
        event.setCreator(creator);
        event.setInvitationEnabled(false);

        EventEntity saved = eventRepository.save(event);
        log.info("Evento {} creado por usuario {}", saved.getId(), creatorId);
        return saved;
    }

    /**
     * Lista todos los eventos creados por un usuario.
     * @throws EntityNotFoundException 
     */
    @Transactional(readOnly = true)
    public List<EventEntity> getEventsByCreator(Long creatorId) throws EntityNotFoundException {
        log.info("Obteniendo eventos creados por usuario {}", creatorId);

        if (!userRepository.existsById(creatorId)) {
            throw new EntityNotFoundException("Usuario no encontrado: " + creatorId);
        }
        return eventRepository.findByCreator_Id(creatorId);
    }

    /**
     * Obtiene un evento por su ID.
     * @throws EntityNotFoundException 
     */
    @Transactional(readOnly = true)
    public EventEntity getEvent(Long eventId) throws EntityNotFoundException {
        log.info("Obteniendo evento {}", eventId);

        return eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));
    }

    /**
     * Actualiza nombre, descripción y fechas de un evento existente.
     * No permite cambiar el creador ni el estado de invitaciones.
     * @throws EntityNotFoundException 
     * @throws IllegalOperationException 
     */
    @Transactional
    public EventEntity updateEvent(Long eventId, EventEntity updated) throws EntityNotFoundException, IllegalOperationException {
        log.info("Actualizando evento {}", eventId);

        EventEntity existing = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));

        // Validar nuevos datos
        validateEvent(updated);

        // Mantener creador e invitaciones
        updated.setId(eventId);
        updated.setCreator(existing.getCreator());
        updated.setInvitationEnabled(existing.isInvitationEnabled());

        EventEntity saved = eventRepository.save(updated);
        log.info("Evento {} actualizado", eventId);
        return saved;
    }

    /**
     * Elimina un evento si existe.
     * @throws EntityNotFoundException 
     */
    @Transactional
    public void deleteEvent(Long eventId) throws EntityNotFoundException {
        log.info("Eliminando evento {}", eventId);

        if (!eventRepository.existsById(eventId)) {
            throw new EntityNotFoundException("Evento no encontrado: " + eventId);
        }
        eventRepository.deleteById(eventId);
        log.info("Evento {} eliminado", eventId);
    }

    /**
     * Habilita o deshabilita el código de invitación de un evento.
     * Solo el creador puede cambiar este flag.
     * @throws EntityNotFoundException 
     * @throws IllegalOperationException 
     */
    @Transactional
    public EventEntity setInvitationEnabled(Long eventId, Long userId, boolean enabled) throws EntityNotFoundException, IllegalOperationException {
        log.info("{} invitaciones para evento {}", enabled ? "Habilitando" : "Deshabilitando", eventId);

        EventEntity event = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));

        if (!event.getCreator().getId().equals(userId)) {
            throw new IllegalOperationException("Solo el creador puede cambiar la invitación");
        }

        event.setInvitationEnabled(enabled);
        EventEntity saved = eventRepository.save(event);

        log.info("Invitaciones {} para evento {}", enabled ? "habilitadas" : "deshabilitadas", eventId);
        return saved;
    }

    /**
     * Valida nombre, descripción y rango de fechas.
     * @throws IllegalOperationException 
     */
    private void validateEvent(EventEntity event) throws IllegalOperationException {
        if (event.getName() == null || event.getName().trim().isEmpty()) {
            throw new IllegalOperationException("El nombre del evento no puede estar vacío");
        }
        if (event.getName().length() < MIN_LENGTH || event.getName().length() > MAX_LENGTH) {
            throw new IllegalOperationException(
                "El nombre debe tener entre " + MIN_LENGTH + " y " + MAX_LENGTH + " caracteres");
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
