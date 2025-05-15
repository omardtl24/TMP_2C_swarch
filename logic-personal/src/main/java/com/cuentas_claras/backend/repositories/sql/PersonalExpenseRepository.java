package com.cuentas_claras.backend.repositories.sql;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.cuentas_claras.backend.models.sql.PersonalExpenseEntity;

@Repository
public interface PersonalExpenseRepository extends JpaRepository<PersonalExpenseEntity, Long> {

    // Buscar por concepto
    List<PersonalExpenseEntity> findByConcept(String concept);

    // Buscar por tipo
    List<PersonalExpenseEntity> findByType(String type);

    // Buscar el Id del usuario que realizó el gasto
    List<PersonalExpenseEntity> findByOwner(Long userId);

    List<PersonalExpenseEntity> findByOwnerAndDateBetween(Long owner, LocalDate start, LocalDate end);

    @Query("SELECT SUM(p.total) FROM PersonalExpenseEntity p WHERE p.owner.id = :userId")
    Double sumTotalByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);

}
