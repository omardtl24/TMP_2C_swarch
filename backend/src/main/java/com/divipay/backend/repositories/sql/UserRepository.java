package com.divipay.backend.repositories.sql;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.divipay.backend.models.sql.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    // búsqueda de usuario por correo
    Optional<UserEntity> findByEmail(String email);

    // búsqueda de usuario por nombre de usuario
    Optional<UserEntity> findByUsername(String username);

}
