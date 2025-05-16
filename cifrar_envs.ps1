$pass = Read-Host -AsSecureString "Passphrase para cifrar"
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass)
$UnsecurePassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

& gpg --batch --yes --passphrase $UnsecurePassword -c env.secrets.json
Move-Item env.secrets.json.gpg env.secrets.gpg -Force
Remove-Item env.secrets.json -Force
Write-Host "Listo: env.secrets.gpg generado y el .json original eliminado."
