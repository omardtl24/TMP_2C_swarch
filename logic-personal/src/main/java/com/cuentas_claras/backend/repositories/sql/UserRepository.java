package com.cuentas_claras.backend.repositories.sql;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cuentas_claras.backend.models.sql.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    // búsqueda de user por correo
    Optional<UserEntity> findByEmail(String email);

    // búsqueda de user por nombre de user
    Optional<UserEntity> findByUsername(String username);

}
