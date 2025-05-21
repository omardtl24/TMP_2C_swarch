package com.cuentas_claras.backend.services;

 
import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.IllegalOperationException;
import com.cuentas_claras.backend.dto.NewParticipationInput;
import com.cuentas_claras.backend.models.mongo.ExpenseDocument;
import com.cuentas_claras.backend.models.mongo.ExpenseDocument.Participation;
import com.cuentas_claras.backend.models.sql.ExpenseEntity;
import com.cuentas_claras.backend.models.sql.EventEntity;
import com.cuentas_claras.backend.repositories.mongo.ExpenseDocumentRepository;
import com.cuentas_claras.backend.repositories.sql.ExpenseRepository;
import com.cuentas_claras.backend.repositories.sql.EventRepository;
import com.cuentas_claras.backend.security.JwtUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ExpenseDocumentRepository expenseDocumentRepository;

    @Autowired
    private EventRepository eventRepository;

    /**
     * Obtiene el ID del usuario autenticado desde el SecurityContext.
     */
    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof JwtUserDetails) {
            Long userId = ((JwtUserDetails) auth.getPrincipal()).getUserId();
            return userId.toString();
        }
        throw new IllegalStateException("No authenticated user found");
    }

    /**
     * Crea un nuevo gasto grupal: guarda imagen si se proporciona, luego documento en MongoDB y registro SQL.
     * @param eventId ID del evento al que pertenece el gasto
     * @param total   Monto total del gasto
     * @param concept Concepto/descripción del gasto
     * @param type    Tipo de gasto (nombre del enum)
     * @param participation Lista de participaciones con usuario, estado y porción
     * @param supportImage Imagen de soporte (opcional)
     * @return Entidad SQL guardada (ExpenseEntity)
     * @throws EntityNotFoundException si el evento no existe
     * @throws IOException si falla la subida de imagen
     */
    @Transactional
    public ExpenseEntity createExpense(
            Long eventId,
            double total,
            String concept,
            String type,
            List<NewParticipationInput> participation,
            MultipartFile supportImage
    ) throws Exception {
        String creatorId = getCurrentUserId();
        log.info("Creando gasto para evento {} por usuario {}", eventId, creatorId);

        EventEntity event = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));

        // Guardar imagen de soporte si existe
        ObjectId imageId = null;
        if (supportImage != null && !supportImage.isEmpty()) {
            imageId = expenseDocumentRepository.saveSupportImage(supportImage);
        }

        // Construir documento Mongo
        ExpenseDocument doc = new ExpenseDocument();
        doc.setPayerId(creatorId);
        doc.setTotal(total);
        doc.setConcept(concept);
        doc.setType(Enum.valueOf(com.cuentas_claras.backend.models.enums.ExpenseType.class, type));
        doc.setSupportImageId(imageId);
        participation.forEach(p -> {
            Participation part = new Participation();
            part.setUserId(p.getUserId());
            part.setState(p.getState());
            part.setPortion(p.getPortion());
            doc.getParticipation().add(part);
        });
        ExpenseDocument savedDoc = expenseDocumentRepository.save(doc);

        // Guardar entidad SQL
        ExpenseEntity expense = new ExpenseEntity();
        expense.setExternalDocId(savedDoc.getId());
        expense.setCreatorId(creatorId);
        expense.setEvent(event);
        ExpenseEntity savedEntity = expenseRepository.save(expense);

        log.info("Gasto {} creado con documento {}", savedEntity.getId(), savedDoc.getId());
        return savedEntity;
    }

    /**
     * Actualiza un gasto existente: actualiza imagen si se proporciona, luego documento Mongo.
     * @param expenseId ID de la entidad SQL
     * @param total   Monto total actualizado
     * @param concept Concepto actualizado
     * @param type    Tipo de gasto actualizado
     * @param participation Lista de participaciones actualizadas
     * @param supportImage Imagen nueva de soporte (opcional)
     * @return Documento Mongo actualizado
     * @throws EntityNotFoundException si no existe gasto o documento
     * @throws IOException si falla la subida de imagen
     */
    @Transactional
    public ExpenseDocument updateExpense(
            Long expenseId,
            double total,
            String concept,
            String type,
            List<NewParticipationInput> participation,
            MultipartFile supportImage
    ) throws Exception {
        ExpenseEntity entity = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado: " + expenseId));

        ExpenseDocument doc = expenseDocumentRepository.findById(entity.getExternalDocId())
            .orElseThrow(() -> new EntityNotFoundException("Documento no encontrado: " + entity.getExternalDocId()));

        if (supportImage != null && !supportImage.isEmpty()) {
            ObjectId imageId = expenseDocumentRepository.saveSupportImage(supportImage);
            doc.setSupportImageId(imageId);
        }

        doc.setTotal(total);
        doc.setConcept(concept);
        doc.setType(Enum.valueOf(com.cuentas_claras.backend.models.enums.ExpenseType.class, type));
        doc.getParticipation().clear();
        participation.forEach(p -> {
            Participation part = new Participation();
            part.setUserId(p.getUserId());
            part.setState(p.getState());
            part.setPortion(p.getPortion());
            doc.getParticipation().add(part);
        });

        log.info("Documento {} actualizado para gasto {}", doc.getId(), expenseId);
        return expenseDocumentRepository.save(doc);
    }

    /**
     * Guarda o reemplaza la imagen de soporte de un gasto existente.
     * @param eventId   ID del evento (no usado directamente)
     * @param expenseId ID de la entidad de gasto
     * @param file      Imagen a subir
     * @return String con el ID de la imagen almacenada
     * @throws IOException si falla la subida
     */
    public String saveSupportImage(String eventId, String expenseId, MultipartFile file) throws IOException {
        ObjectId id = expenseDocumentRepository.saveSupportImage(file);
        log.info("Imagen de soporte guardada con ID {} para gasto {}", id.toHexString(), expenseId);
        return id.toHexString();
    }

    // Resto de métodos sin cambios para consultas y eliminación...

    @Transactional(readOnly = true)
    public List<ExpenseEntity> getExpensesByEvent(Long eventId) throws EntityNotFoundException {
        log.info("Listando gastos SQL del evento {}", eventId);
        EventEntity event = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));
        return expenseRepository.findByEvent(event);
    }

    @Transactional(readOnly = true)
    public List<ExpenseDocument> getExpensesPaidByMe() {
        String userId = getCurrentUserId();
        log.info("Listando documentos de gastos pagados por {}", userId);
        return expenseDocumentRepository.findByPayerId(userId);
    }

    @Transactional(readOnly = true)
    public List<ExpenseDocument> getExpensesParticipatedByMe() {
        String userId = getCurrentUserId();
        log.info("Listando documentos de gastos donde participa {}", userId);
        return expenseDocumentRepository.findByParticipationUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<ExpenseDocument> searchByType(String type) {
        log.info("Buscando documentos de gastos con tipo {}", type);
        return expenseDocumentRepository.findByType(type);
    }

    @Transactional(readOnly = true)
    public List<ExpenseDocument> searchByConcept(String keyword) {
        log.info("Buscando documentos de gastos con concepto que contenga '{}'", keyword);
        return expenseDocumentRepository.findByConceptContainingIgnoreCase(keyword);
    }

    @Transactional
    public void deleteExpense(Long expenseId) throws EntityNotFoundException, IllegalOperationException {
        log.info("Intentando eliminar gasto {}", expenseId);
        ExpenseEntity entity = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new EntityNotFoundException("Gasto no encontrado: " + expenseId));

        ExpenseDocument doc = expenseDocumentRepository.findById(entity.getExternalDocId())
            .orElseThrow(() -> new EntityNotFoundException("Documento no encontrado: " + entity.getExternalDocId()));
        boolean allPaid = doc.getParticipation().stream().allMatch(p -> p.getState() == 1);
        if (allPaid) {
            throw new IllegalOperationException("No se puede eliminar un gasto ya pagado completamente");
        }

        expenseRepository.delete(entity);
        expenseDocumentRepository.deleteById(entity.getExternalDocId());
        log.info("Gasto {} eliminado", expenseId);
    }

    @Transactional(readOnly = true)
    public Map<String, Double> calculateBalances(Long eventId) throws EntityNotFoundException {
        log.info("Calculando balances para evento {}", eventId);
        EventEntity event = eventRepository.findById(eventId)
            .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));
        List<ExpenseEntity> sqlExpenses = expenseRepository.findByEvent(event);
        List<ExpenseDocument> docs = sqlExpenses.stream()
            .map(e -> expenseDocumentRepository.findById(e.getExternalDocId()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toList());
        Map<String, Double> paid = docs.stream().collect(
            Collectors.groupingBy(
                ExpenseDocument::getPayerId,
                Collectors.summingDouble(ExpenseDocument::getTotal)
            )
        );
        Map<String, Double> owed = docs.stream()
            .flatMap(doc -> doc.getParticipation().stream()
                .map(p -> new Object[]{p.getUserId(), p.getPortion()}))
            .collect(Collectors.groupingBy(
                arr -> (String) arr[0],
                Collectors.summingDouble(arr -> (double) arr[1])
            ));
        return owed.keySet().stream().collect(
            Collectors.toMap(
                userId -> userId,
                userId -> paid.getOrDefault(userId, 0.0) - owed.get(userId)
            )
        );
    }

    @Transactional(readOnly = true)
    public Double sumAllExpenses() {
        log.info("Sumando todos los gastos registrados");
        Double total = expenseDocumentRepository.sumAllTotals();
        return total != null ? total : 0.0;
    }


    /** Suma todos los totales de los gastos asociados a un evento */
    @Transactional(readOnly = true)
    public Double sumExpensesByEvent(Long eventId) throws EntityNotFoundException {
        EventEntity event = eventRepository.findById(eventId)
        .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));
        List<ExpenseEntity> expenses = expenseRepository.findByEvent(event);
        double suma = 0;
        for (ExpenseEntity e : expenses) {
        ExpenseDocument doc = expenseDocumentRepository.findById(e.getExternalDocId())
            .orElseThrow(() -> new EntityNotFoundException(
            "Documento no encontrado: " + e.getExternalDocId()));
        suma += doc.getTotal();
        }
        return suma;
    }

    /** Suma sólo los gastos que el usuario autenticado pagó en un evento */
    @Transactional(readOnly = true)
    public Double sumExpensesPaidByUserInEvent(Long eventId) throws EntityNotFoundException {
        EventEntity event = eventRepository.findById(eventId)
        .orElseThrow(() -> new EntityNotFoundException("Evento no encontrado: " + eventId));
        String me = getCurrentUserId();
        List<ExpenseEntity> expenses = expenseRepository.findByEvent(event);
        double suma = 0;
        for (ExpenseEntity e : expenses) {
        ExpenseDocument doc = expenseDocumentRepository.findById(e.getExternalDocId())
            .orElseThrow(() -> new EntityNotFoundException(
            "Documento no encontrado: " + e.getExternalDocId()));
        if (me.equals(doc.getPayerId())) {
            suma += doc.getTotal();
        }
        }
        return suma;
    }
}

