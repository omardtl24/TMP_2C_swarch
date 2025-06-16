# Cargar variables del .env al entorno del proceso y ajustar URLs para desarrollo local
Get-Content .env | ForEach-Object {
    if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        # Ajuste para Postgres
        if ($name -eq "SPRING_DATASOURCE_URL" -and $value -match "data_postgres") {
            $value = $value -replace "data_postgres", "localhost"
        }
        # Ajuste para MongoDB
        if ($name -eq "SPRING_DATA_MONGODB_URI" -and $value -match "data_mongo") {
            $value = $value -replace "data_mongo", "localhost"
        }
        [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}
# Ejecutar Maven directamente (no ./mvnw)
mvn spring-boot:run
