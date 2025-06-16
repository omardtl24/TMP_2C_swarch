package com.cuentas_claras.backend.repositories;


import java.util.List;
// import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cuentas_claras.backend.models.sql.EventEntity;
import com.cuentas_claras.backend.models.sql.ExpenseEntity;


@Repository
public interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long> {

    //1. Obtiene todos los gastos asociados a un evento dado.
    List<ExpenseEntity> findByEvent(EventEntity event);
    
    //2. Obtiene todos los gastos creados por un usuario (creatorId).
    List<ExpenseEntity> findByCreatorId(String creatorId);

    // // 3. Encuentra un gasto a partir de su externalDocId (clave al documento Mongo).
    // Optional<ExpenseEntity> findByExternalDocId(String externalDocId);
    // Optional<ExpenseEntity> findByIdAndExternalDocId(Long id, String externalDocId);


}