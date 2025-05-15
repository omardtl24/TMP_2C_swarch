package com.cuentas_claras.backend.repositories.sql;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cuentas_claras.backend.models.sql.EventEntity;
import com.cuentas_claras.backend.models.sql.EventParticipantsEntity;

@Repository
public interface EventParticipantsRepository extends JpaRepository<EventParticipantsEntity, Long> {

    // 1. Buscar el id del participante de un evento
    Optional<EventParticipantsEntity> findByParticipantId(String participantId);

    // 2. Listar todos los participantes de un evento específico
    List<EventParticipantsEntity> findByEvent(EventEntity event);

    // 3. Buscar la participación específica de un usuario en un evento
    Optional<EventParticipantsEntity> findByEventAndParticipantId(EventEntity event, Long participantId);

    // 4. Verificar si un usuario ya está inscrito en un evento (booleano implícito)
    boolean existsByEventAndParticipantId(EventEntity event, Long participantId);
    
}
