package com.divipay.backend.repositories.mongo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.divipay.backend.models.mongo.ExpenseDocument;

@Repository
public interface ExpenseRepository extends MongoRepository<ExpenseDocument, String> {

    // buscar por pagador
    List<ExpenseDocument> findByPayerId(String payerId);    

    // buscar por tipo
    List<ExpenseDocument> findByType(String type);

    // buscar por concepto
    List<ExpenseDocument> findByConceptContainingIgnoreCase(String keyword);

    // ver gastos donde participa el user
    @Query("{ 'participation.userId' : ?0 }")
    List<ExpenseDocument> findByParticipationUserId(String userId);

    // todos los gastos relacionados con un user (payer o participante)
    @Query("{ $or: [ { 'payerId': ?0 }, { 'participation.userId': ?0 } ] }")
    List<ExpenseDocument> findAllByUserId(String userId);

}
