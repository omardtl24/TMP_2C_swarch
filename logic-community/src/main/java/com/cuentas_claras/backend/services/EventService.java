package com.cuentas_claras.backend.services;

import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.IllegalOperationException;
import com.cuentas_claras.backend.models.sql.EventEntity;
import com.cuentas_claras.backend.repositories.sql.EventRepository;
import com.cuentas_claras.backend.utils.InvitationCodeUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cuentas_claras.backend.security.JwtUserDetails;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
public class EventService {

    private static final int MIN_LENGTH = 3;
    private static final int MAX_LENGTH = 60;

    @Autowired
    private EventRepository eventRepository;

    
    /**
     * Obtiene el ID del usuario autenticado desde el SecurityContext.
     */
    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof JwtUserDetails) {
            Long userId = ((JwtUserDetails) auth.getPrincipal()).getUserId();
            return userId.toString();
        }
        throw new IllegalStateException("No authenticated user found in context");
    }



    /**
     * Crea un nuevo evento asociado al usuario autenticado.
     *
     * @param event La entidad del evento a crear.
     * @return La entidad creada con su ID y creador asignados.
     * @throws IllegalOperationException si los datos del evento no son válidos.
     */
    @Transactional
    public EventEntity createEvent(EventEntity event) throws IllegalOperationException {
        String creatorId = getCurrentUserId();
        log.info("Creando evento para usuario {}", creatorId);

        validateEvent(event);
        event.setCreatorId(creatorId);
        event.setInvitationEnabled(false);
        // Generar código de invitación (inicialmente inactivo)
        event.setInvitationCode(InvitationCodeUtil.generateCodeFromId(event.getId()));

        EventEntity saved = eventRepository.save(event);
        log.info("Evento {} creado", saved.getId());
        return saved;
    }

    /**
     * Obtiene todos los eventos creados por un usuario.
     *
     * @param creatorId ID del usuario creador.
     * @return Lista de eventos.
     */
    @Transactional(readOnly = true)
    public List<EventEntity> getMyEvents() {
       String creatorId = getCurrentUserId();
        log.info("Listando eventos creados por {}", creatorId);
        return eventRepository.findByCreatorId(creatorId);
    }

    /**
     * Obtiene un evento por su ID.
     *
     * @param eventId ID del evento.
     * @return La entidad del evento.
     * @throws EntityNotFoundException si no se encuentra el evento.
     */
    @Transactional(readOnly = true)
    public EventEntity getEvent(Long eventId) throws EntityNotFoundException {
        log.info("Consultando evento {}", eventId);
        return eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));
    }

    /**
     * Busca eventos por nombre 
     */
    @Transactional(readOnly = true)
    public List<EventEntity> searchByName(String name) {
        log.info("Buscando eventos que contengan '{}' en el nombre", name);
        return eventRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Obtiene eventos futuros a partir de la fecha dada.
     */
    @Transactional(readOnly = true)
    public List<EventEntity> getUpcomingEvents(LocalDate from) {
        log.info("Buscando eventos con fecha de inicio después de {}", from);
        return eventRepository.findByBeginDateAfter(from);
    }

    /**
     * Busca eventos en un rango de fechas.
     */
    @Transactional(readOnly = true)
    public List<EventEntity> getEventsBetween(Date start, Date end) {
        log.info("Buscando eventos entre {} y {}", start, end);
        return eventRepository.findByBeginDateBetween(start, end);
    }


    /**
     * Actualiza un evento existente.
     *
     * @param eventId ID del evento a actualizar.
     * @param updated Entidad con los datos actualizados.
     * @return Evento actualizado.
     * @throws EntityNotFoundException si el evento no existe.
     * @throws IllegalOperationException si los datos no son válidos.
     */
    @Transactional
    public EventEntity updateEvent(Long eventId, EventEntity updated)
            throws EntityNotFoundException, IllegalOperationException {
        log.info("Actualizando evento {}", eventId);

        EventEntity existing = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));

        validateEvent(updated);
        updated.setId(eventId);
        updated.setCreatorId(existing.getCreatorId());
        updated.setInvitationEnabled(existing.isInvitationEnabled());
        updated.setInvitationCode(existing.getInvitationCode());

        EventEntity saved = eventRepository.save(updated);
        log.info("Evento {} actualizado", saved.getId());
        return saved;
    }

    /**
     * Elimina un evento por su ID.
     *
     * @param eventId ID del evento a eliminar.
     * @throws EntityNotFoundException si el evento no existe.
     */
    @Transactional
    public void deleteEvent(Long eventId) throws EntityNotFoundException {
        log.info("Eliminando evento {}", eventId);
        if (!eventRepository.existsById(eventId)) {
            throw new EntityNotFoundException("Evento no encontrado: " + eventId);
        }
        eventRepository.deleteById(eventId);
    }

    /**
     * Habilita o deshabilita el uso de invitaciones para un evento.
     *
     * @param eventId ID del evento.
     * @param enabled true para habilitar, false para deshabilitar.
     * @return Evento actualizado.
     * @throws EntityNotFoundException si el evento no existe.
     * @throws IllegalOperationException si el usuario no es el creador.
     */
    @Transactional
    public EventEntity setInvitationEnabled(Long eventId, boolean enabled)
            throws EntityNotFoundException, IllegalOperationException {
        String userId = getCurrentUserId();
        log.info("{} invitaciones para evento {}", enabled ? "Habilitando" : "Deshabilitando", eventId);

        EventEntity event = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));

        if (!event.getCreatorId().equals(userId)) {
            throw new IllegalOperationException("Solo el creador puede cambiar la invitación");
        }

        event.setInvitationEnabled(enabled);
        if (enabled) {
            event.setInvitationCode(InvitationCodeUtil.generateCodeFromId(eventId));
        } else {
            event.setInvitationCode(null);
        }

        EventEntity saved = eventRepository.save(event);
        log.info("Invitaciones {} para evento {}", enabled ? "habilitadas" : "deshabilitadas", eventId);
        return saved;
    }

    /**
     * Valida los datos de un evento.
     *
     * @param event Evento a validar.
     * @throws IllegalOperationException si alguno de los datos no es válido.
     */
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