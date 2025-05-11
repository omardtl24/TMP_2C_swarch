package com.divipay.backend.repositories.sql;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.divipay.backend.models.sql.EventEntity;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Integer> {

    // ver creador de un evento
    List<EventEntity> findByCreator_Id(Integer creatorId);

    // ver eventos en los que se participa
    List<EventEntity> findByParticipants_Id(Integer participantId);

}