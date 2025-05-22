#!/bin/bash
read -sp "Passphrase para desencriptar: " PASSPHRASE
export ENV_SECRET_PASSPHRASE="$PASSPHRASE"
if [ -f "generar_envs.py" ]; then
  python3 generar_envs.py
else
  echo "No se encontró generar_envs.py"
fi
