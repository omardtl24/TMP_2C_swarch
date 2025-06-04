package com.cuentas_claras.backend.controllers;

import com.cuentas_claras.backend.dto.EventDTO;
import com.cuentas_claras.backend.dto.JoinEventRequestDTO;
import com.cuentas_claras.backend.dto.ParticipantDetailDTO;
import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.IllegalOperationException;
import com.cuentas_claras.backend.models.sql.EventEntity;
import com.cuentas_claras.backend.models.sql.EventParticipantsEntity;
import com.cuentas_claras.backend.services.EventParticipantsService;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventParticipantsController {

    @Autowired
    private EventParticipantsService participantsService;

    @Autowired
    private ModelMapper modelMapper;

    /**
     * Permite que el usuario autenticado se una a un evento por código de invitación.
     */
    @PostMapping("/join")
    @ResponseStatus(HttpStatus.CREATED)
    public void joinEvent(@RequestBody JoinEventRequestDTO request)
            throws EntityNotFoundException, IllegalOperationException {
        participantsService.joinEventByInvitationCode(request.getInvitationCode());
    }

    /**
     * Elimina un participante del evento.
     */
    @DeleteMapping("/{eventId}/participants/{participantId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeParticipant(
            @PathVariable Long eventId,
            @PathVariable String participantId
    ) throws EntityNotFoundException {
        participantsService.removeParticipant(eventId, participantId);
    }


    /**
     * Lista todos los eventos en los que el usuario autenticado es participante.
     */
    @GetMapping("/participating")
    @ResponseStatus(HttpStatus.OK)
    public List<EventDTO> getEventsIParticipateIn() {
        List<EventEntity> events = participantsService.getEventsWhereIParticipate();
        return modelMapper.map(events, new TypeToken<List<EventDTO>>(){}.getType());
    }


    /**
     * Lista los participantes de un evento.
     */
    @GetMapping("/{eventId}/participants")
    @ResponseStatus(HttpStatus.OK)
    public List<ParticipantDetailDTO> getParticipants(@PathVariable Long eventId)
            throws EntityNotFoundException {
        List<EventParticipantsEntity> participants = participantsService.getParticipants(eventId);
        return modelMapper.map(participants, new TypeToken<List<ParticipantDetailDTO>>(){}.getType());
    }

    /**
     * Verifica si el usuario autenticado participa en el evento.
     */
    @GetMapping("/{eventId}/participants/me")
    @ResponseStatus(HttpStatus.OK)
    public boolean isMeParticipant(@PathVariable Long eventId)
            throws EntityNotFoundException {
        return participantsService.isUserParticipant(eventId);
    }
}
