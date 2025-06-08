# Cargar variables del .env al entorno del proceso y ajustar URLs para desarrollo local
Get-Content .env | ForEach-Object {
    if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        # Ajuste para Postgres
        if ($name -eq "USERS_DATASOURCE_URL" -and $value -match "data-users-db") {
            $value = $value -replace "data-users-db", "localhost"
        }
        [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}
# Ejecutar Maven directamente (no ./mvnw)
mvn spring-boot:run
