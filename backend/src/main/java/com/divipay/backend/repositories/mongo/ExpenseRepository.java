package com.divipay.backend.repositories.mongo;

import java.util.List;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.divipay.backend.models.mongo.ExpenseDocument;

@Repository
public interface ExpenseRepository extends MongoRepository<ExpenseDocument, String> {
    List<ExpenseDocument> findByPayerId(String payerId);
    List<ExpenseDocument> findByType(String type);
    List<ExpenseDocument> findByConceptContainingIgnoreCase(String keyword);

    @Query("{ 'participation.userId' : ?0 }")
    List<ExpenseDocument> findByParticipationUserId(String userId);

    @Query("{ $or: [ { 'payerId': ?0 }, { 'participation.userId': ?0 } ] }")
    List<ExpenseDocument> findAllByUserId(String userId);


    @Aggregation("{ $match: { payerId: ?0 } },{ $group: { _id: null, total: { $sum: \"$total\" } } }")
    Double sumTotalByPayerId(String payerId);
}
