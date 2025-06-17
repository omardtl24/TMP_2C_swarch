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

    // Buscar por ownerId 
    List<PersonalExpenseEntity> findByOwnerId(String ownerId);

    // Buscar por ownerId + rango de fechas
    List<PersonalExpenseEntity> findByOwnerIdAndDateBetween(String ownerId, LocalDate start, LocalDate end);

    // Suma de todos los totales de un ownerId
    @Query("SELECT SUM(p.total) FROM PersonalExpenseEntity p WHERE p.ownerId = :ownerId")
    Double sumTotalByOwnerId(@org.springframework.data.repository.query.Param("ownerId") String ownerId);

}
