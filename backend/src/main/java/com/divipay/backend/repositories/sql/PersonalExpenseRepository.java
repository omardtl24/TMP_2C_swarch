package com.divipay.backend.repositories.sql;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.divipay.backend.models.sql.PersonalExpenseEntity;

@Repository
public interface PersonalExpenseRepository extends JpaRepository<PersonalExpenseEntity, Long> {

    // Buscar por concepto
    List<PersonalExpenseEntity> findByConcept(String concept);

    // Buscar por tipo
    List<PersonalExpenseEntity> findByType(String type);

    // Buscar todos los gastos personales de un usuario
    List<PersonalExpenseEntity> findByOwner_Id(Long userId);

    @Query("SELECT SUM(p.total) FROM PersonalExpenseEntity p WHERE p.owner.id = :userId")
    Double sumTotalByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);

}
