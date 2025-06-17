package com.cuentas_claras.backend.repositories.mongo;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class ExpenseDocumentRepositoryCustomImpl implements ExpenseDocumentRepositoryCustom {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Override
    public ObjectId saveSupportImage(MultipartFile file) throws IOException {
        return (ObjectId) gridFsTemplate.store(
                file.getInputStream(),
                file.getOriginalFilename(),
                file.getContentType()
        );
    }
}