# Instalación de PHPMailer

Este proyecto utiliza PHPMailer. Como no se usa Composer, instálalo manualmente:

1. Descargar PHPMailer (`.zip`) desde GitHub releases.
2. Copiar el contenido de `src/` dentro de `backend/PHPMailer/src/`
3. La estructura debe quedar:
```
backend/
 └── PHPMailer/
     └── src/
         ├── PHPMailer.php
         ├── SMTP.php
         ├── Exception.php
         └── ...
```

Variables SMTP en `.env` (backend):
```
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_SECURE=tls
SMTP_USER=tu_correo@dominio.com
SMTP_PASS=tu_password
SMTP_FROM_EMAIL=tu_correo@dominio.com
SMTP_FROM_NAME=Emedev
```

