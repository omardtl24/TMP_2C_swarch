package com.cuentas_claras.backend.services;

import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.models.mongo.ExpenseDocument;
import com.cuentas_claras.backend.models.mongo.ExpenseDocument.Participation;
import com.cuentas_claras.backend.repositories.mongo.ExpenseDocumentRepository;
import com.cuentas_claras.backend.security.JwtUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
public class ExpenseDocumentService {

    @Autowired
    private ExpenseDocumentRepository expenseDocumentRepository;

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

    public ObjectId saveSupportImage(MultipartFile file) {
        try {
            ObjectId imageId = expenseDocumentRepository.saveSupportImage(file);
            log.info("Imagen de soporte guardada con ID {}", imageId.toHexString());
            return imageId;
        } catch (Exception e) {
            log.error("Error guardando imagen de soporte: {}", e.getMessage());
            throw new RuntimeException("No se pudo guardar la imagen de soporte", e);
        }
    }

    /**
     * Crea un nuevo documento de gasto en MongoDB 
     */
    @Transactional
    public ExpenseDocument createExpenseDocument(
            double total,
            String concept,
            String type,
            String payerId,
            List<Participation> participation,
            ObjectId supportImageId  
    ) {
        // String payerId = getCurrentUserId();
        log.info("Creando documento de gasto en Mongo para usuario {}", payerId);

        if (total <= 0) {
            throw new IllegalArgumentException("El total debe ser mayor a cero.");
        }

        if (participation == null || participation.isEmpty()) {
            throw new IllegalArgumentException("Debe haber al menos un participante.");
        }

        double sumaPortions = participation.stream()
            .mapToDouble(Participation::getPortion)
            .sum();
        if (Math.abs(sumaPortions - total) > 0.01) {
            throw new IllegalArgumentException("La suma de las porciones no coincide con el total.");
        }

        Set<String> userIds = new HashSet<>();
        for (Participation p : participation) {
            if (p.getUserId() == null || p.getUserId().trim().isEmpty()) {
                throw new IllegalArgumentException("Cada participante debe tener un userId válido.");
            }
            if (!userIds.add(p.getUserId())) {
                throw new IllegalArgumentException("Un usuario no puede participar más de una vez.");
            }
        }

        if (supportImageId != null) {
            String idStr = supportImageId.toHexString();
            if (!ObjectId.isValid(idStr)) {
                throw new IllegalArgumentException("supportImageId no es un ObjectId válido.");
            }
        }

        ExpenseDocument doc = new ExpenseDocument();
        doc.setPayerId(payerId);
        doc.setTotal(total);
        doc.setConcept(concept);
        doc.setType(Enum.valueOf(com.cuentas_claras.backend.models.enums.ExpenseType.class, type));
        doc.setSupportImageId(supportImageId);
        doc.getParticipation().addAll(participation);

        ExpenseDocument saved = expenseDocumentRepository.save(doc);
        log.info("Documento de gasto creado con id {}", saved.getId());
        return saved;
    }

    /**
     * Actualiza un documento de gasto existente en MongoDB.
     * @throws EntityNotFoundException 
     */
    @Transactional
    public ExpenseDocument updateExpenseDocument(
            String documentId,
            double total,
            String concept,
            String type,
            String payerId,
            List<Participation> participation,
            ObjectId supportImageId
    ) throws EntityNotFoundException {
        log.info("Actualizando documento de gasto {} en Mongo", documentId);

        ExpenseDocument existing = expenseDocumentRepository.findById(documentId)
            .orElseThrow(() -> new EntityNotFoundException("Documento no encontrado: " + documentId));

        // String payerId = getCurrentUserId();
        // if (!payerId.equals(existing.getPayerId())) {
        //     throw new IllegalArgumentException("Solo el creador del gasto puede actualizarlo.");
        // }

        if (total <= 0) {
            throw new IllegalArgumentException("El total debe ser mayor a cero.");
        }

        if (participation == null || participation.isEmpty()) {
            throw new IllegalArgumentException("Debe haber al menos un participante.");
        }

        double sumaPortions = participation.stream()
            .mapToDouble(Participation::getPortion)
            .sum();
        if (Math.abs(sumaPortions - total) > 0.01) {
            throw new IllegalArgumentException("La suma de las porciones no coincide con el total.");
        }

        Set<String> userIds = new HashSet<>();
        for (Participation p : participation) {
            if (p.getUserId() == null || p.getUserId().trim().isEmpty()) {
                throw new IllegalArgumentException("Cada participante debe tener un userId válido.");
            }
            if (!userIds.add(p.getUserId())) {
                throw new IllegalArgumentException("Un usuario no puede participar más de una vez.");
            }
        }

        if (supportImageId != null) {
            String idStr = supportImageId.toHexString();
            if (!ObjectId.isValid(idStr)) {
                throw new IllegalArgumentException("supportImageId no es un ObjectId válido.");
            }
        }

        // Actualizar campos
        existing.setTotal(total);
        existing.setConcept(concept);
        existing.setType(Enum.valueOf(com.cuentas_claras.backend.models.enums.ExpenseType.class, type));
        existing.setSupportImageId(supportImageId);
        existing.getParticipation().clear();
        existing.getParticipation().addAll(participation);

        ExpenseDocument updated = expenseDocumentRepository.save(existing);
        log.info("Documento {} actualizado correctamente", documentId);
        return updated;
    }

    /**
     * Elimina un documento de gasto en MongoDB.
     * @throws EntityNotFoundException 
     */
    @Transactional
    public void deleteExpenseDocument(String documentId) throws EntityNotFoundException {
        log.info("Eliminando documento de gasto {} en Mongo", documentId);
        if (!expenseDocumentRepository.existsById(documentId)) {
            throw new EntityNotFoundException("No se puede eliminar: documento no encontrado con id: " + documentId);
        }
        expenseDocumentRepository.deleteById(documentId);
        log.info("Documento {} eliminado", documentId);
    }

    /**
     * Obtiene un documento de gasto por su ID.
     * @throws EntityNotFoundException 
     */
    @Transactional(readOnly = true)
    public ExpenseDocument getExpenseDocumentById(String documentId) throws EntityNotFoundException {
        return expenseDocumentRepository.findById(documentId)
            .orElseThrow(() -> new EntityNotFoundException("Documento no encontrado con id: " + documentId));
    }

    /**
     * Lista todos los documentos de gastos donde el usuario autenticado es payer.
     */
    @Transactional(readOnly = true)
    public List<ExpenseDocument> getExpensesPaidByMe() {
        String payerId = getCurrentUserId();
        log.info("Listando documentos pagados por {}", payerId);
        return expenseDocumentRepository.findByPayerId(payerId);
    }

    /**
     * Lista todos los documentos de gastos donde participa el usuario autenticado.
     */
    @Transactional(readOnly = true)
    public List<ExpenseDocument> getExpensesParticipatedByMe() {
        String userId = getCurrentUserId();
        log.info("Listando documentos donde participa {}", userId);
        return expenseDocumentRepository.findByParticipationUserId(userId);
    }

    /**
     * Busca documentos de gastos por tipo.
     */
    @Transactional(readOnly = true)
    public List<ExpenseDocument> searchByType(String type) {
        log.info("Buscando documentos de tipo {}", type);
        return expenseDocumentRepository.findByType(type);
    }

    /**
     * Busca documentos de gastos por palabra clave en concepto.
     */
    @Transactional(readOnly = true)
    public List<ExpenseDocument> searchByConcept(String keyword) {
        log.info("Buscando documentos con concepto conteniendo '{}'", keyword);
        return expenseDocumentRepository.findByConceptContainingIgnoreCase(keyword);
    }
}
