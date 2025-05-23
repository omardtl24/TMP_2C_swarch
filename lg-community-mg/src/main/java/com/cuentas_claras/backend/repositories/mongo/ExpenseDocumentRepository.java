package com.cuentas_claras.backend.repositories.mongo;

import java.util.List;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.cuentas_claras.backend.models.mongo.ExpenseDocument;

@Repository
public interface ExpenseDocumentRepository extends MongoRepository<ExpenseDocument, String> , ExpenseDocumentRepositoryCustom {
    List<ExpenseDocument> findByPayerId(String payerId);
    List<ExpenseDocument> findByType(String type);
    List<ExpenseDocument> findByConceptContainingIgnoreCase(String keyword);

    @Query("{ 'participation.userId' : ?0 }")
    List<ExpenseDocument> findByParticipationUserId(String userId);

    @Query("{ $or: [ { 'payerId': ?0 }, { 'participation.userId': ?0 } ] }")
    List<ExpenseDocument> findAllByUserId(String userId);


    @Aggregation("{ $match: { payerId: ?0 } },{ $group: { _id: null, total: { $sum: \"$total\" } } }")
    Double sumTotalByPayerId(String payerId);

    @Aggregation("{ $group: { _id: null, total: { $sum: \"$total\" } } }")
    Double sumAllTotals();

    
}
