package com.divipay.backend.repositories.sql;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.divipay.backend.models.sql.ExpenseEntity;

@Repository
public interface ExpenseSQLRepository extends JpaRepository<ExpenseEntity, Long> {

    List<ExpenseEntity> findByEvent_Id(Long eventId);

    List<ExpenseEntity> findByPayer_Id(Long payerId);

    // enlace a documento Mongo: buscar un gasto concreto
    Optional<ExpenseEntity> findByExternalDocId(String externalDocId);

    Optional<ExpenseEntity> findByIdAndExternalDocId(Long id, String externalDocId);


}