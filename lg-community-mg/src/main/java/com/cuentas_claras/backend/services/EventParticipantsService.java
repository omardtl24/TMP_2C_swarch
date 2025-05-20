package com.cuentas_claras.backend.services;

import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.IllegalOperationException;
import com.cuentas_claras.backend.models.UserCache;
import com.cuentas_claras.backend.models.sql.EventEntity;
import com.cuentas_claras.backend.models.sql.EventParticipantsEntity;
import com.cuentas_claras.backend.repositories.sql.EventParticipantsRepository;
import com.cuentas_claras.backend.repositories.sql.EventRepository;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
public class EventParticipantsService {

    @Autowired
    private EventParticipantsRepository participantsRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserCache userCache;

    /**
     * Permite que el usuario autenticado se una a un evento mediante un código de invitación.
     *
     * @param invitationCode Código de invitación del evento al que se desea unir.
     * @throws EntityNotFoundException Si el código de invitación no corresponde a ningún evento.
     * @throws IllegalOperationException Si el evento no tiene habilitadas las invitaciones o el usuario ya está inscrito.
     */

    @Transactional
    public void joinEventByInvitationCode(String invitationCode) throws EntityNotFoundException, IllegalOperationException {
        String userId = userCache.getUserId();
        log.info("Usuario {} intenta unirse con código {}", userId, invitationCode);

        EventEntity event = eventRepository.findByInvitationCode(invitationCode)
                .orElseThrow(() -> new EntityNotFoundException("Código de invitación inválido"));

        if (!event.isInvitationEnabled()) {
            throw new IllegalOperationException("El evento no tiene habilitadas las invitaciones");
        }

        if (participantsRepository.existsByEventAndParticipantId(event, userId)) {
            throw new IllegalOperationException("Ya estás inscrito en este evento");
        }

        EventParticipantsEntity participation = new EventParticipantsEntity();
        participation.setEvent(event);
        participation.setParticipantId(userId);
        participantsRepository.save(participation);

        log.info("Usuario {} unido al evento {}", userId, event.getId());
    }

    /**
     * Elimina a un participante específico de un evento dado.
     *
     * @param eventId ID del evento del cual se desea eliminar al participante.
     * @param participantId ID del participante a eliminar.
     * @throws EntityNotFoundException Si el evento o el participante no son encontrados.
     */

    @Transactional
    public void removeParticipant(Long eventId, String participantId) throws EntityNotFoundException {
        log.info("Eliminando participante {} del evento {}", participantId, eventId);

        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado"));

        EventParticipantsEntity participant = participantsRepository.findByEventAndParticipantId(event, participantId)
                .orElseThrow(() -> new EntityNotFoundException("Participante no encontrado en el evento"));

        participantsRepository.delete(participant);

        log.info("Participante {} eliminado del evento {}", participantId, eventId);
    }

    /**
     * Obtiene la lista de participantes de un evento.
     *
     * @param eventId ID del evento del cual se desea obtener la lista de participantes.
     * @return Lista de entidades que representan a los participantes del evento.
     * @throws EntityNotFoundException Si el evento no es encontrado.
     */
    @Transactional(readOnly = true)
    public List<EventParticipantsEntity> getParticipants(Long eventId) throws EntityNotFoundException {
        log.info("Listando participantes del evento {}", eventId);

        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado"));

        return participantsRepository.findByEvent(event);
    }

    /**
     * Verifica si el usuario autenticado es participante de un evento.
     *
     * @param eventId ID del evento a verificar.
     * @return true si el usuario es participante del evento, false en caso contrario.
     * @throws EntityNotFoundException Si el evento no es encontrado.
     */
    @Transactional(readOnly = true)
    public boolean isUserParticipant(Long eventId) throws EntityNotFoundException {
        String userId = userCache.getUserId();
        EventEntity event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado"));
        return participantsRepository.existsByEventAndParticipantId(event, userId);
    }
}
