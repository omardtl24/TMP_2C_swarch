package com.divipay.backend.repositories.sql;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.divipay.backend.models.sql.EventEntity;
import com.divipay.backend.models.sql.UserEntity;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long> {

    List<EventEntity> findByCreator_Id(Long creatorId);
    List<EventEntity> findByCreator(UserEntity creator);
    List<EventEntity> findByParticipants_Id(Long participantId);


    List<EventEntity> findByBeginDateBetween(Date start, Date end);



}