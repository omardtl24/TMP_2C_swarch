package com.cuentas_claras.backend.repositories.sql;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cuentas_claras.backend.models.sql.EventEntity;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long> {

    // 1. Buscar el ID del creador del evento
    List<EventEntity> findByCreatorId(String creatorId);

    // 2. Buscar un evento por nombre
    List<EventEntity> findByNameContainingIgnoreCase(String name);

    // 3. Eventos futuros (para agenda)
    List<EventEntity> findByBeginDateAfter(LocalDate date);

    // 4. Encontrar el codigo de invitación luego de generado
    Optional<EventEntity> findByInvitationCode(String code);

    // 5. Hacer busqueda de eventos por fecha
    List<EventEntity> findByBeginDateBetween(Date start, Date end);




}