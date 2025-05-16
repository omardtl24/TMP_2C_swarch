$pass = Read-Host -AsSecureString "Passphrase para desencriptar"
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass)
$UnsecurePassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
$env:ENV_SECRET_PASSPHRASE = $UnsecurePassword
if (Test-Path "generar_envs.exe") {
    ./generar_envs.exe
} elseif (Test-Path "generar_envs.py") {
    python generar_envs.py
} else {
    Write-Error "No se encontró generar_envs.exe ni generar_envs.py"
}
