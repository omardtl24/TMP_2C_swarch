package com.cuentas_claras.backend.services;

import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.models.sql.EventEntity;
import com.cuentas_claras.backend.models.sql.ExpenseEntity;
import com.cuentas_claras.backend.repositories.EventRepository;
import com.cuentas_claras.backend.repositories.ExpenseRepository;
import com.cuentas_claras.backend.security.JwtUserDetails;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.HttpEntity;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
// import org.springframework.util.CollectionUtils;
// import org.springframework.web.client.RestTemplate;

import java.util.*;
// import java.util.stream.Collectors;

@Slf4j
@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private EventRepository eventRepository;

    // /** URL del endpoint GraphQL del microservicio de expenses */
    // @Value("${mongo.service.graphql.url}")
    // private String mongoGraphqlUrl;

    // private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public ExpenseEntity createExpense(Long eventId, String externalDocId) throws EntityNotFoundException {
        String creatorId = getCurrentUserId();
        log.info("Creando ExpenseEntity (SQL) para eventId={} con externalDocId={} por user={}",
                 eventId, externalDocId, creatorId);

        EventEntity event = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Event not found: " + eventId));

        ExpenseEntity expense = new ExpenseEntity();
        expense.setCreatorId(creatorId);
        expense.setExternalDocId(externalDocId);
        expense.setEvent(event);

        ExpenseEntity saved = expenseRepository.save(expense);
        log.info("ExpenseEntity creado con id={} y externalDocId={}", saved.getId(), externalDocId);
        return saved;
    }

    @Transactional
    public void deleteExpense(Long expenseId) throws EntityNotFoundException {
        log.info("Eliminando ExpenseEntity con id={}", expenseId);
        ExpenseEntity existing = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new EntityNotFoundException("Expense not found: " + expenseId));
        expenseRepository.delete(existing);
        log.info("ExpenseEntity {} eliminado", expenseId);
    }

    @Transactional(readOnly = true)
    public List<ExpenseEntity> getExpensesByEvent(Long eventId) throws EntityNotFoundException {
        log.info("Obteniendo ExpenseEntity SQL por eventId={}", eventId);
        EventEntity event = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Event not found: " + eventId));
        return expenseRepository.findByEvent(event);
    }

    @Transactional(readOnly = true)
    public ExpenseEntity getExpenseDetail(Long expenseId) throws EntityNotFoundException {
        return expenseRepository.findById(expenseId)
            .orElseThrow(() -> new EntityNotFoundException("Expense not found: " + expenseId));
    }

    // @Transactional(readOnly = true)
    // public Double sumExpensesByEvent(Long eventId) throws EntityNotFoundException {
    //     log.info("Calculando sumExpensesByEvent para eventId={}", eventId);

    //     List<ExpenseEntity> expenses = getExpensesByEvent(eventId);
    //     double suma = 0.0;
    //     for (ExpenseEntity e : expenses) {
    //         Double totalDoc = fetchTotalFromMongo(e.getExternalDocId());
    //         suma += (totalDoc != null ? totalDoc : 0.0);
    //     }
    //     log.info("sumExpensesByEvent para eventId={} = {}", eventId, suma);
    //     return suma;
    // }

    // @Transactional(readOnly = true)
    // public Double sumExpensesPaidByUserInEvent(Long eventId) throws EntityNotFoundException {
    //     String me = getCurrentUserId();
    //     log.info("Calculando sumExpensesPaidByUserInEvent para eventId={} y user={}", eventId, me);

    //     List<ExpenseEntity> expenses = getExpensesByEvent(eventId);
    //     double suma = 0.0;
    //     for (ExpenseEntity e : expenses) {
    //         Map<String, Object> doc = fetchDocumentFromMongo(e.getExternalDocId());
    //         if (doc != null && me.equals(doc.get("payerId"))) {
    //             Object totalObj = doc.get("total");
    //             if (totalObj instanceof Number) {
    //                 suma += ((Number) totalObj).doubleValue();
    //             }
    //         }
    //     }
    //     log.info("sumExpensesPaidByUserInEvent para eventId={} y user={} = {}", eventId, me, suma);
    //     return suma;
    // }

    // @Transactional(readOnly = true)
    // public List<Balance> calculateBalances(Long eventId) throws EntityNotFoundException {
    //     log.info("Calculando calculateBalances para eventId={}", eventId);

    //     List<ExpenseEntity> expenses = getExpensesByEvent(eventId);
    //     Map<String, Double> paid = new HashMap<>();
    //     Map<String, Double> owed = new HashMap<>();

    //     for (ExpenseEntity e : expenses) {
    //         Map<String, Object> doc = fetchDocumentFromMongo(e.getExternalDocId());
    //         if (doc == null) continue;

    //         String payerId = (String) doc.get("payerId");
    //         Object totalObj = doc.get("total");
    //         double total = (totalObj instanceof Number) ? ((Number) totalObj).doubleValue() : 0.0;
    //         paid.put(payerId, paid.getOrDefault(payerId, 0.0) + total);

    //         List<Map<String, Object>> parts = (List<Map<String, Object>>) doc.get("participation");
    //         if (!CollectionUtils.isEmpty(parts)) {
    //             for (Map<String, Object> p : parts) {
    //                 String userId = (String) p.get("userId");
    //                 Object portionObj = p.get("portion");
    //                 double portion = (portionObj instanceof Number) ? ((Number) portionObj).doubleValue() : 0.0;
    //                 owed.put(userId, owed.getOrDefault(userId, 0.0) + portion);
    //             }
    //         }
    //     }

    //     Set<String> allUsers = new HashSet<>();
    //     allUsers.addAll(paid.keySet());
    //     allUsers.addAll(owed.keySet());

    //     List<Balance> result = allUsers.stream()
    //         .map(u -> new Balance(u, paid.getOrDefault(u, 0.0) - owed.getOrDefault(u, 0.0)))
    //         .collect(Collectors.toList());

    //     log.info("calculateBalances para eventId={} = {}", eventId, result);
    //     return result;
    // }

    // @Transactional(readOnly = true)
    // public Double sumAllExpenses() {
    //     log.info("Calculando sumAllExpenses (todos los gastos globales)");

    //     List<ExpenseEntity> allExpenses = expenseRepository.findAll();
    //     double suma = 0.0;
    //     for (ExpenseEntity e : allExpenses) {
    //         Double totalDoc = fetchTotalFromMongo(e.getExternalDocId());
    //         suma += (totalDoc != null ? totalDoc : 0.0);
    //     }
    //     log.info("sumAllExpenses = {}", suma);
    //     return suma;
    // }
    // //  Llamadas GraphQL al microservicio de expenses

    // private Double fetchTotalFromMongo(String docId) {
    //     String graphqlQuery = """
    //     query ExpenseDocumentById($documentId: ID!) {
    //       expenseDocumentById(documentId: $documentId) {
    //         total
    //       }
    //     }
    //     """;

    //     Map<String, Object> variables = Map.of("documentId", docId);
    //     Map<String, Object> payload = Map.of(
    //         "query", graphqlQuery,
    //         "variables", variables
    //     );

    //     HttpHeaders headers = buildHeadersForMongo();
    //     headers.setContentType(MediaType.APPLICATION_JSON);

    //     HttpEntity<Object> entity = new HttpEntity<>(payload, headers);

    //     try {
    //         Map<String, Object> resp = restTemplate.postForObject(
    //             mongoGraphqlUrl, entity, Map.class
    //         );
    //         if (resp == null || resp.get("errors") != null) return null;

    //         Map<String, Object> data = (Map<String, Object>) resp.get("data");
    //         Map<String, Object> doc = (Map<String, Object>) data.get("expenseDocumentById");
    //         Object totalObj = doc.get("total");
    //         return (totalObj instanceof Number) ? ((Number) totalObj).doubleValue() : null;
    //     } catch (Exception ex) {
    //         log.error("Error fetchTotalFromMongo para docId={}: {}", docId, ex.getMessage());
    //         return null;
    //     }
    // }

    // private Map<String, Object> fetchDocumentFromMongo(String docId) {
    //     String graphqlQuery = """
    //     query ExpenseDocumentById($documentId: ID!) {
    //       expenseDocumentById(documentId: $documentId) {
    //         payerId
    //         total
    //         participation {
    //           userId
    //           state
    //           portion
    //         }
    //       }
    //     }
    //     """;

    //     Map<String, Object> variables = Map.of("documentId", docId);
    //     Map<String, Object> payload = Map.of(
    //         "query", graphqlQuery,
    //         "variables", variables
    //     );

    //     HttpHeaders headers = buildHeadersForMongo();
    //     headers.setContentType(MediaType.APPLICATION_JSON);

    //     HttpEntity<Object> entity = new HttpEntity<>(payload, headers);

    //     try {
    //         Map<String, Object> resp = restTemplate.postForObject(
    //             mongoGraphqlUrl, entity, Map.class
    //         );
    //         if (resp == null || resp.get("errors") != null) return null;

    //         Map<String, Object> data = (Map<String, Object>) resp.get("data");
    //         return (Map<String, Object>) data.get("expenseDocumentById");
    //     } catch (Exception ex) {
    //         log.error("Error fetchDocumentFromMongo para docId={}: {}", docId, ex.getMessage());
    //         return null;
    //     }
    // }

    // private HttpHeaders buildHeadersForMongo() {
    //     HttpHeaders headers = new HttpHeaders();

    //     Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    //     if (auth != null && auth.getPrincipal() instanceof JwtUserDetails) {
    //         JwtUserDetails user = (JwtUserDetails) auth.getPrincipal();
    //         headers.set("x-user-id", String.valueOf(user.getUserId()));
    //         headers.set("x-user-email", user.getEmail());
    //         headers.set("x-user-username", user.getUsername());
    //         headers.set("x-user-name", user.getFullName());
    //     }

    //     return headers;
    // }

    /**
     * Obtiene el ID del usuario autenticado desde JwtUserDetails en el SecurityContext.
     */
    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof JwtUserDetails) {
            return ((JwtUserDetails) auth.getPrincipal()).getUserId().toString();
        }
        throw new IllegalStateException("No authenticated user found");
    }
}
