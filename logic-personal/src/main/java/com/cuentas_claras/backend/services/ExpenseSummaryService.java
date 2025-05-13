package com.cuentas_claras.backend.services;

import com.cuentas_claras.backend.models.sql.ExpenseEntity;
import com.cuentas_claras.backend.models.mongo.ExpenseDocument;
import com.cuentas_claras.backend.repositories.sql.ExpenseSQLRepository;
import com.cuentas_claras.backend.repositories.mongo.ExpenseRepository;
import com.cuentas_claras.backend.repositories.sql.PersonalExpenseRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
public class ExpenseSummaryService {

    @Autowired
    private ExpenseSQLRepository expenseSQLRepository;

    @Autowired
    private ExpenseRepository expenseMongoRepository;

    @Autowired
    private PersonalExpenseRepository personalExpenseRepository;

    @Transactional
    public double getTotalPersonalExpenses(Long userId) {
        return personalExpenseRepository.findByOwner_Id(userId)
                .stream().mapToDouble(e -> e.getTotal()).sum();
    }

    @Transactional
    public double getTotalGroupExpenses(Long userId) {
        List<ExpenseEntity> expenses = expenseSQLRepository.findByPayer_Id(userId);

        double total = 0.0;
        for (ExpenseEntity e : expenses) {
            String docId = e.getExternalDocId();
            Optional<ExpenseDocument> mongo = expenseMongoRepository.findById(docId);
            total += mongo.map(ExpenseDocument::getTotal).orElse(0.0);
        }
        return total;
    }

    @Transactional
    public Map<String, Double> getDebtsForEvent(Long eventId) {
        List<ExpenseEntity> expenses = expenseSQLRepository.findByEvent_Id(eventId);
        Map<String, Double> balanceMap = new HashMap<>();

        for (ExpenseEntity expense : expenses) {
            Optional<ExpenseDocument> docOpt = expenseMongoRepository.findById(expense.getExternalDocId());
            if (docOpt.isEmpty()) continue;

            ExpenseDocument doc = docOpt.get();
            String payer = doc.getPayerId();
            for (ExpenseDocument.Participation p : doc.getParticipation()) {
                String user = p.getUserId();
                if (!user.equals(payer)) {
                    balanceMap.put(user, balanceMap.getOrDefault(user, 0.0) + p.getPortion());
                    balanceMap.put(payer, balanceMap.getOrDefault(payer, 0.0) - p.getPortion());
                }
            }
        }

        return balanceMap;
    }
}
