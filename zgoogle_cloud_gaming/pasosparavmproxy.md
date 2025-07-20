Aquí tienes el resumen ordenado para configurar la VM del proxy inverso con HTTPS válido (Certbot):

1. Crear la VM en la subred pública:
```sh
gcloud compute instances create proxy-web-vm \
  --zone=us-east1-b \
  --machine-type=e2-micro \
  --subnet=public-proxy-subnet \
  --image-family=debian-12 \
  --image-project=debian-cloud \
  --tags=http-server,https-server \
  --address="" \
  --boot-disk-size=10GB
```

2. Asignar IP pública estática:
```sh
gcloud compute addresses create proxy-web-ip --region=us-east1
gcloud compute instances delete-access-config proxy-web-vm --zone=us-east1-b
gcloud compute instances add-access-config proxy-web-vm --zone=us-east1-b --address=proxy-web-ip
```

3. Crear regla de firewall para HTTP/HTTPS:
```sh
gcloud compute firewall-rules create allow-proxy-web-http-https \
  --network=cuentas-claras \
  --allow=tcp:80,tcp:443 \
  --target-tags=http-server,https-server \
  --direction=INGRESS \
  --priority=1000 \
  --source-ranges=0.0.0.0/0 \
  --description="Permitir tráfico HTTP y HTTPS a VMs proxy web"
```

4. Instalar Nginx en la VM:
```sh
gcloud compute ssh proxy-web-vm --zone=us-east1-b
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

5. Apuntar tu dominio (ej: cuentasclaras.duckdns.org) a la IP pública de la VM.

6. Obtener certificado SSL válido con Certbot:
```sh
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d cuentasclaras.duckdns.org
```
Sigue las instrucciones y elige redirigir todo a HTTPS si lo deseas.

7. Configuración de Nginx (Certbot la ajusta, pero si editas manualmente):
```nginx
server {
    listen 80;
    server_name cuentasclaras.duckdns.org;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name cuentasclaras.duckdns.org;

    ssl_certificate     /etc/letsencrypt/live/cuentasclaras.duckdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cuentasclaras.duckdns.org/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://<IP_PUBLICA_LOADBALANCER_FRONTEND>;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

8. Recargar Nginx tras cualquier cambio:
```sh
sudo nginx -t
sudo systemctl reload nginx
```

¡Con esto tienes proxy inverso seguro, con HTTPS válido y auto-renovable!