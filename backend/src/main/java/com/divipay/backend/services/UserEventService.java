package com.divipay.backend.services;

import java.util.List;

import com.divipay.backend.exceptions.EntityNotFoundException;
import com.divipay.backend.exceptions.IllegalOperationException;
import com.divipay.backend.models.sql.EventEntity;
import com.divipay.backend.models.sql.UserEntity;
import com.divipay.backend.repositories.sql.EventRepository;
import com.divipay.backend.repositories.sql.UserRepository;
import com.divipay.backend.utils.InvitationCodeUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserEventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     *Genera un código de invitación de 6 caracteres para un evento.
     */
    @Transactional(readOnly = true)
    public String generateInvitationCode(Long eventId) throws EntityNotFoundException {
        log.info("Generando código de invitación para evento {}", eventId);
        if (!eventRepository.existsById(eventId)) {
            throw new EntityNotFoundException("Evento no encontrado: " + eventId);
        }
        return InvitationCodeUtil.generateCodeFromId(eventId);
    }

    /**
     * Un usuario se une a un evento ingresando el código.
     */
    @Transactional
    public EventEntity joinEventByInvitationCode(Long userId, String code)
            throws EntityNotFoundException, IllegalOperationException {
        log.info("Usuario {} intenta unirse con código {}", userId, code);

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + userId));

        EventEntity event = eventRepository.findAll().stream()
                .filter(e -> code.equals(InvitationCodeUtil.generateCodeFromId(e.getId())))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Código de invitación inválido"));

        if (!event.isInvitationEnabled()) {
            throw new IllegalOperationException("Invitaciones deshabilitadas para el evento: " + event.getId());
        }

        if (event.getParticipants().contains(user)) {
            throw new IllegalOperationException("Usuario ya participa en este evento");
        }

        event.getParticipants().add(user);
        user.getEventsParticipating().add(event);
        eventRepository.save(event);
        userRepository.save(user);

        log.info("Usuario {} agregado al evento {}", userId, event.getId());
        return event;
    }


    /**
     *Permite al creador de un evento expulsar a un participante.
     */
    @Transactional
    public void kickParticipant(Long eventId, Long creatorId, Long userId)
            throws EntityNotFoundException, IllegalOperationException {
        log.info("Creador {} expulsando a usuario {} del evento {}", creatorId, userId, eventId);

        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));

        if (!event.getCreator().getId().equals(creatorId)) {
            throw new IllegalOperationException("Solo el creador puede expulsar participantes");
        }

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + userId));

        if (!event.getParticipants().remove(user)) {
            throw new IllegalOperationException("El usuario no es participante de este evento");
        }

        user.getEventsParticipating().remove(event);
        eventRepository.save(event);
        userRepository.save(user);

        log.info("Usuario {} expulsado del evento {}", userId, eventId);
    }

    /**
     * Obtiene la lista de participantes de un evento.
     */
    @Transactional(readOnly = true)
    public List<UserEntity> getParticipants(Long eventId) throws EntityNotFoundException {
        log.info("Obteniendo participantes del evento {}", eventId);
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));
        return event.getParticipants();
    }

    /**
     * Obtiene todos los eventos en los que participa un usuario.
     */
    @Transactional(readOnly = true)
    public List<EventEntity> getEventsByParticipant(Long userId) throws EntityNotFoundException {
        log.info("Obteniendo eventos para participante {}", userId);
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + userId));
        return user.getEventsParticipating();
    }
}
