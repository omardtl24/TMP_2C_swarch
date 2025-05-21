#!/usr/bin/env python3
import os
import sys
import json
import subprocess
import shutil
import re
from pathlib import Path

# Configuración
SECRETS_GPG = 'env.secrets.gpg'
SECRETS_JSON = 'env.secrets.json'
PASSPHRASE_ENV = 'ENV_SECRET_PASSPHRASE'

# Utilidad para imprimir en color (opcional)
def info(msg):
    print(f"\033[92m{msg}\033[0m")
def error(msg):
    print(f"\033[91m{msg}\033[0m", file=sys.stderr)

def main():
    # 1. Verificar passphrase
    passphrase = os.environ.get(PASSPHRASE_ENV)
    if not passphrase:
        error(f"Falta la variable de entorno {PASSPHRASE_ENV} (clave de desencriptado)")
        sys.exit(1)

    # 2. Desencriptar el archivo GPG
    info(f"Desencriptando {SECRETS_GPG}...")
    try:
        subprocess.run([
            'gpg', '--batch', '--yes', '--passphrase', passphrase,
            '-o', SECRETS_JSON, '-d', SECRETS_GPG
        ], check=True)
    except Exception as e:
        error(f"Error desencriptando: {e}")
        sys.exit(1)

    # 3. Leer el JSON
    with open(SECRETS_JSON, 'r', encoding='utf-8') as f:
        secrets = json.load(f)

    # 4. Construir diccionario global de variables
    global_vars = {}
    for service_vars in secrets.values():
        global_vars.update(service_vars)

    # 5. Función para expandir referencias globales recursivamente
    var_pattern = re.compile(r'\$\{([A-Za-z0-9_]+)\}')
    def expand_refs(val):
        prev = None
        while isinstance(val, str) and var_pattern.search(val):
            def repl(match):
                ref = match.group(1)
                return str(global_vars.get(ref, match.group(0)))
            val_new = var_pattern.sub(repl, val)
            if val_new == prev:
                break
            prev = val
            val = val_new
        return val

    # 6. Generar y copiar .env por servicio
    for service, vars_dict in secrets.items():
        env_file = f"{service}.env"
        info(f"Generando {env_file}...")
        lines = []
        for key, value in vars_dict.items():
            value_expanded = expand_refs(value)
            lines.append(f"{key}={value_expanded}")
        with open(env_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines) + '\n')
        # Copiar a carpeta si existe y eliminar el .env de la raíz si se copió
        copied = False
        for alt in {service, service.replace('_', '-'), service.replace('-', '_')}:
            if Path(alt).is_dir():
                shutil.copy(env_file, Path(alt) / '.env')
                info(f"Copiado {env_file} a {alt}/.env")
                copied = True
        # Eliminar el archivo de la raíz si se copió a alguna carpeta
        if copied:
            try:
                os.remove(env_file)
                info(f"Eliminado {env_file} de la raíz.")
            except Exception:
                pass

    info("Listo.")
    input("\nPresiona ENTER para salir...")

if __name__ == '__main__':
    main()
