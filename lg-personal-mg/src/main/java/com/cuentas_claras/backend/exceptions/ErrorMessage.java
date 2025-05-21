package com.cuentas_claras.backend.exceptions;

public final class ErrorMessage {
	public static final String USUARIO_NO_ENCONTRADO = "El user con el id proporcionado no fue encontrado";
	public static final String META_NO_ENCONTRADA = "La meta con el id proporcionado no fue encontrada";
	public static final String TAREA_NO_ENCONTRADA = "La tarea con el id proporcionado no fue encontrada";
	public static final String HITO_NO_ENCONTRADO = "El hito con el id proporcionado no fue encontrado";
	public static final String NOTIFICACION_NO_ENCONTRADA = "La notificación con el id proporcionado no fue encontrada";
	public static final String COMENTARIO_NO_ENCONTRADO = "El comentario con el id proporcionado no fue encontrado";
	public static final String REGISTRO_NO_ENCONTRADO = "El registro con el id proporcionado no fue encontrado";	
	public static final String USUARIO_NOT_FOUND = "The user with the given id was not found";
	public static final String NOTIFICACION_NOT_FOUND = "The notification with the given id was not found";

	private ErrorMessage() {
		throw new IllegalStateException("Utility class");
	}
}