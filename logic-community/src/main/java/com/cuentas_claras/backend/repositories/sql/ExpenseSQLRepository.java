package com.cuentas_claras.backend.repositories.sql;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cuentas_claras.backend.models.sql.EventEntity;
import com.cuentas_claras.backend.models.sql.ExpenseEntity;
import com.cuentas_claras.backend.models.sql.UserEntity;

@Repository
public interface ExpenseSQLRepository extends JpaRepository<ExpenseEntity, Long> {


    List<ExpenseEntity> findByEvent_Id(Long eventId);
    List<ExpenseEntity> findByEvent(EventEntity event);
    List<ExpenseEntity> findByPayer_Id(Long payerId);
    List<ExpenseEntity> findByPayer(UserEntity payer);

    Optional<ExpenseEntity> findByExternalDocId(String externalDocId);
    Optional<ExpenseEntity> findByIdAndExternalDocId(Long id, String externalDocId);

    @Query("SELECT SUM(eLink) FROM ExpenseEntity eLink WHERE eLink.payer.id = :payerId")
    Double sumTotalByPayerId(@Param("payerId") Long payerId);


}