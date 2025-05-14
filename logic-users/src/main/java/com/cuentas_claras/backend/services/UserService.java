package com.cuentas_claras.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cuentas_claras.backend.repositories.UserRepository;
import com.cuentas_claras.backend.exceptions.EntityNotFoundException;
import com.cuentas_claras.backend.exceptions.ErrorMessage;
import com.cuentas_claras.backend.models.UserEntity;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    /**
     * Obtiene la lista todos los usuarios.
     *
     * @return Colección de objetos de UserEntity.
     */
    @Transactional
    public List<UserEntity> getUsers() {
        log.info("Inicia proceso de consultar todos los users");
        return userRepository.findAll();
    }
    

    /**
     * Obtiene los datos de una instancia de User a partir de su ID.
     *
     * @param userId Identificador de la instancia a consultar
     * @return Instancia de UserEntity con los datos del User consultado.
     */
    @Transactional
    public UserEntity getUser(Long userId) throws EntityNotFoundException {
        log.info("Inicia proceso de consultar el user con id = {}", userId);
        Optional<UserEntity> userEntity = userRepository.findById(userId);

        if (userEntity.isEmpty()) {
            log.error("User con id = {} no encontrado", userId);
            throw new EntityNotFoundException(ErrorMessage.USUARIO_NO_ENCONTRADO);
        }

        log.info("Termina proceso de consultar el user con id = {}", userId);
        return userEntity.get();
    }

    /**
     * Busca un usuario por su email.
     *
     * @param email Email del usuario a buscar
     * @return Optional<UserEntity> con el usuario si existe
     */
    @Transactional
    public Optional<UserEntity> findByEmail(String email) {
        log.info("Buscando usuario por email: {}", email);
        return userRepository.findByEmail(email);
    }

    /**
     * Borrar un usuario por ID
     *
     * @param userId El ID del usuario borrar
     * @throws EntityNotFoundException Si el user no es encontrado
     */

    @Transactional
    public void deleteUser(Long userId) throws EntityNotFoundException{
        log.info("Deleting user id = {}", userId);

        // Buscar el usuario en la base de datos
        Optional<UserEntity> usuarioEntityOptional = userRepository.findById(userId);
        if (usuarioEntityOptional.isEmpty()) {
            throw new EntityNotFoundException(ErrorMessage.USUARIO_NO_ENCONTRADO);
        }

        userRepository.deleteById(userId);
    }

    /**
     * Guarda un usuario en la base de datos.
     * @param user El usuario a guardar
     * @return El usuario guardado
     */
    @Transactional
    public UserEntity save(UserEntity user) {
        return userRepository.save(user);
    }

}
