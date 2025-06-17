package com.cuentas_claras.backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cuentas_claras.backend.models.sql.EventEntity;
import com.cuentas_claras.backend.models.sql.EventParticipantsEntity;

@Repository
public interface EventParticipantsRepository extends JpaRepository<EventParticipantsEntity, Long> {

    // Buscar la participación específica de un usuario en un evento
    Optional<EventParticipantsEntity> findByEventAndParticipantId(EventEntity event, String participantId);

    // Verificar si un usuario ya está inscrito en un evento
    boolean existsByEventAndParticipantId(EventEntity event, String participantId);

    // Listar todos los participantes de un evento específico
    List<EventParticipantsEntity> findByEvent(EventEntity event);

    // Listar todos los eventos donde participa un usuario (útil para resumen de eventos)
    List<EventParticipantsEntity> findByParticipantId(String participantId);


}
