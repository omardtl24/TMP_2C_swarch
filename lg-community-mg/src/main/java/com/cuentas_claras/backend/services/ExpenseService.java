package com.cuentas_claras.backend.services;

import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.IllegalOperationException;
import com.cuentas_claras.backend.models.mongo.ExpenseDocument;
import com.cuentas_claras.backend.models.sql.ExpenseEntity;
import com.cuentas_claras.backend.models.sql.EventEntity;
import com.cuentas_claras.backend.repositories.mongo.ExpenseDocumentRepository;
import com.cuentas_claras.backend.repositories.sql.ExpenseRepository;
import com.cuentas_claras.backend.repositories.sql.EventRepository;
import com.cuentas_claras.backend.models.UserCache;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;       // SQL 

    @Autowired
    private ExpenseDocumentRepository expenseDocumentRepository; // Mongo 

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserCache userCache;

    /**
     * Crea un nuevo gasto grupal: primero guarda el documento en MongoDB y luego el registro SQL.
     * @param eventId ID del evento al que pertenece el gasto
     * @param document Detalle del gasto (ExpenseDocument)
     * @return Entidad SQL guardada (ExpenseEntity)
     * @throws EntityNotFoundException si el evento no existe
     */
    @Transactional
    public ExpenseEntity createExpense(Long eventId, ExpenseDocument document) throws EntityNotFoundException {
        String creatorId = userCache.getUserId();
        log.info("Creando gasto para evento {} por usuario {}", eventId, creatorId);

        EventEntity event = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));

        document.setPayerId(creatorId);
        ExpenseDocument savedDoc = expenseDocumentRepository.save(document);

        ExpenseEntity expense = new ExpenseEntity();
        expense.setExternalDocId(savedDoc.getId());
        expense.setCreatorId(creatorId);
        expense.setEvent(event);

        ExpenseEntity savedEntity = expenseRepository.save(expense);
        log.info("Gasto {} creado con documento {}", savedEntity.getId(), savedDoc.getId());
        return savedEntity;
    }

    /**
     * Obtiene todos los gastos SQL asociados a un evento.
     * @param eventId ID del evento
     * @return Lista de ExpenseEntity
     * @throws EntityNotFoundException si el evento no existe
     */
    @Transactional(readOnly = true)
    public List<ExpenseEntity> getExpensesByEvent(Long eventId) throws EntityNotFoundException {
        log.info("Listando gastos SQL del evento {}", eventId);
        EventEntity event = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));
        return expenseRepository.findByEvent(event);
    }

    /**
     * Obtiene el historial de gastos (documentos Mongo) donde el usuario ha pagado.
     * @return Lista ExpenseDocument
     */
    @Transactional(readOnly = true)
    public List<ExpenseDocument> getExpensesPaidByMe() {
        String userId = userCache.getUserId();
        log.info("Listando documentos de gastos pagados por {}", userId);
        return expenseDocumentRepository.findByPayerId(userId);
    }

    /**
     * Obtiene el historial de gastos (documentos Mongo) donde el usuario ha participado.
     * @return Lista ExpenseDocument
     */
    @Transactional(readOnly = true)
    public List<ExpenseDocument> getExpensesParticipatedByMe() {
        String userId = userCache.getUserId();
        log.info("Listando documentos de gastos donde participa {}", userId);
        return expenseDocumentRepository.findByParticipationUserId(userId);
    }

    /**
     * Busca gastos por tipo de gasto.
     * @param type Tipo de gasto (ExpenseType.name())
     * @return Lista de ExpenseDocument filtrados
     */
    @Transactional(readOnly = true)
    public List<ExpenseDocument> searchByType(String type) {
        log.info("Buscando documentos de gastos con tipo {}", type);
        return expenseDocumentRepository.findByType(type);
    }

    /**
     * Busca gastos por palabra clave en el concepto.
     * @param keyword texto a buscar en el concepto
     * @return Lista de ExpenseDocument filtrados
     */
    @Transactional(readOnly = true)
    public List<ExpenseDocument> searchByConcept(String keyword) {
        log.info("Buscando documentos de gastos con concepto que contenga '{}'", keyword);
        return expenseDocumentRepository.findByConceptContainingIgnoreCase(keyword);
    }

    /**
     * Actualiza un gasto: modifica el documento Mongo y mantiene la referencia SQL.
     * @param expenseId ID de la entidad SQL
     * @param document Nuevos datos del documento
     * @return Documento actualizado
     * @throws EntityNotFoundException si no existe el gasto
     */
    @Transactional
    public ExpenseDocument updateExpense(Long expenseId, ExpenseDocument document) throws EntityNotFoundException {
        ExpenseEntity entity = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado: " + expenseId));

        String docId = entity.getExternalDocId();
        document.setId(docId);
        log.info("Actualizando documento {} para gasto {}", docId, expenseId);
        return expenseDocumentRepository.save(document);
    }

    /**
     * Elimina un gasto si no ha sido marcado como pagado por todos.
     * @param expenseId ID de la entidad SQL
     * @throws EntityNotFoundException si no existe
     * @throws IllegalOperationException si ya fue pagado completamente
     */
    @Transactional
    public void deleteExpense(Long expenseId) throws EntityNotFoundException, IllegalOperationException {
        log.info("Intentando eliminar gasto {}", expenseId);
        ExpenseEntity entity = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado: " + expenseId));

        ExpenseDocument doc = expenseDocumentRepository.findById(entity.getExternalDocId())
            .orElseThrow(() -> new EntityNotFoundException("Documento no encontrado: " + entity.getExternalDocId()));

        boolean allPaid = doc.getParticipation().stream()
            .allMatch(p -> p.getState() == 1); // suponiendo state=1 significa pagado
        if (allPaid) {
            throw new IllegalOperationException("No se puede eliminar un gasto ya pagado completamente");
        }

        expenseRepository.delete(entity);
        expenseDocumentRepository.deleteById(entity.getExternalDocId());
        log.info("Gasto {} eliminado", expenseId);
    }

    /**
     * Calcula el balance individual dentro de un evento: cuánto debe o le deben.
     * @param eventId ID del evento
     * @return Mapa usuarioId→balance (positivo es a favor, negativo es deuda)
     * @throws EntityNotFoundException si el evento no existe
     */
    @Transactional(readOnly = true)
    public Map<String, Double> calculateBalances(Long eventId) throws EntityNotFoundException {
        log.info("Calculando balances para evento {}", eventId);
        EventEntity event = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));

        // Obtener todos los documentos vinculados a este evento
        List<ExpenseEntity> sqlExpenses = expenseRepository.findByEvent(event);
        List<ExpenseDocument> docs = sqlExpenses.stream()
            .map(e -> expenseDocumentRepository.findById(e.getExternalDocId()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());

        // Sumar totales pagados por cada payer
        Map<String, Double> paid = docs.stream().collect(
            Collectors.groupingBy(
                ExpenseDocument::getPayerId,
                Collectors.summingDouble(ExpenseDocument::getTotal)
            )
        );
        // Distribuir cada gasto entre participantes
        Map<String, Double> owed = docs.stream()
            .flatMap(doc -> doc.getParticipation().stream()
                .map(p -> new Object[]{p.getUserId(), p.getPortion()}))
            .collect(Collectors.groupingBy(
                arr -> (String)arr[0],
                Collectors.summingDouble(arr -> (double)arr[1])
            ));

        // Balance = pagado - debido
        return owed.keySet().stream().collect(
            Collectors.toMap(
                userId -> userId,
                userId -> paid.getOrDefault(userId, 0.0) - owed.get(userId)
            )
        );
    }
    
    /**
     * Suma el total de todos los gastos registrados (en MongoDB).
     * @return Suma total de todos los gastos; 0.0 si no hay registros
     */
    @Transactional(readOnly = true)
    public Double sumAllExpenses() {
        log.info("Sumando todos los gastos registrados");
        // Asumimos que el repositorio Mongo define sumAllTotals()
        Double total = expenseDocumentRepository.sumAllTotals();
        return total != null ? total : 0.0;
    }
}
