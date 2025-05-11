package com.divipay.backend.models.mongo;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Data;

@Data
@Document(collection = "expenses")
public class ExpenseDocument {

    @Id
    private String id;
    private String payerId;
    private double total;
    private String concept;
    private String type;

    private List<Participation> participation = new ArrayList<>();

    @Field("support_image_id")
    private ObjectId supportImageId;

    @Data
    public static class Participation {
        private String userId;
        private int state;
        private double portion;
    }
}
