#!/bin/bash
read -sp "Passphrase para cifrar: " PASSPHRASE
gpg --batch --yes --passphrase "$PASSPHRASE" -c env.secrets.json
mv env.secrets.json.gpg env.secrets.gpg
echo -e "\nListo: env.secrets.gpg generado y el .json original eliminado."
