package com.cuentas_claras.backend.config;

import graphql.schema.Coercing;
import graphql.schema.CoercingParseLiteralException;
import graphql.schema.CoercingParseValueException;
import graphql.schema.CoercingSerializeException;
import graphql.schema.GraphQLScalarType;  
import org.springframework.web.multipart.MultipartFile;

public class UploadScalar {
  public static GraphQLScalarType build() {
    return GraphQLScalarType.newScalar()
      .name("Upload")
      .description("A file upload part in a multipart request")
      .coercing(new Coercing<MultipartFile,String>() {
        @Override
        public String serialize(Object dataFetcherResult) {
          throw new CoercingSerializeException("Upload is input-only");
        }
        @Override
        public MultipartFile parseValue(Object input) {
          if (input instanceof MultipartFile mpf) return mpf;
          throw new CoercingParseValueException("Expected MultipartFile");
        }
        @Override
        public MultipartFile parseLiteral(Object input) {
          throw new CoercingParseLiteralException("Must use variables for Upload");
        }
      })
      .build();
  }
}