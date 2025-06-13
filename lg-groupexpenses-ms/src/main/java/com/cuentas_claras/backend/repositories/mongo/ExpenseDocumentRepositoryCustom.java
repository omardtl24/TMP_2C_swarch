package com.cuentas_claras.backend.repositories.mongo;

import org.bson.types.ObjectId;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ExpenseDocumentRepositoryCustom {
    ObjectId saveSupportImage(MultipartFile file) throws IOException;
}