package com.divipay.backend.models.sql;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

import lombok.Data;
import uk.co.jemos.podam.common.PodamExclude;

/**
 * Entidad genérica de la que heredan todas las entidades. Contiene la
 * referencia al atributo id
 *
 */

@Data
@MappedSuperclass
public abstract class BaseEntity {

	@PodamExclude
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
}