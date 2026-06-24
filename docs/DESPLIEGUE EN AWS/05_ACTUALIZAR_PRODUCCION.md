# Paso 5: Actualizar Producción (Desplegar Cambios Nuevos)

Cada vez que modifiques el frontend en tu PC (nuevas funcionalidades, correcciones de bugs, cambios de estilo), necesitas subir esos cambios al servidor de producción. Este proceso tiene **dos partes**: una en tu PC y otra en el servidor AWS.

---

## A) En tu PC (Subir cambios a GitHub)

Abre una terminal en la carpeta del proyecto en tu computadora:

```bash
cd gestorlab-landing
```

Guarda tus cambios y súbelos a GitHub:

```bash
git add .
git commit -m "feat: descripción breve de lo que cambiaste"
git push origin main
```

**Qué hace cada comando:**
- `git add .` → Marca todos los archivos modificados para subirlos.
- `git commit -m "..."` → Crea un "paquete" con esos cambios y un mensaje descriptivo.
- `git push origin main` → Envía ese paquete a GitHub.

**Espera a que termine el push.** Solo cuando GitHub ya tenga el código nuevo, pasa al servidor.

---

## B) En el Servidor AWS (vía SSH)

### B.1 — Conectarte al servidor

**En Windows (PowerShell):**
```powershell
cd C:\ruta\donde\guardaste\la\clave
ssh -i gestorlab-landing-key.pem ec2-user@IP_PUBLICA_EC2
```

**En Linux/Mac:**
```bash
ssh -i gestorlab-landing-key.pem ec2-user@IP_PUBLICA_EC2
```

---

### B.2 — Ir a la carpeta del proyecto

```bash
cd /home/ec2-user/gestorlab-landing
```

Verifica que estás en el lugar correcto:
```bash
pwd
ls
```

- `pwd` debe mostrar: `/home/ec2-user/gestorlab-landing`
- `ls` debe listar archivos como `Dockerfile`, `docker-compose.yml`, `package.json`, `src/`, etc.

---

### B.3 — Descargar el código nuevo desde GitHub

```bash
git pull origin main
```

**Qué hace:** Compara el código del servidor con GitHub y actualiza los archivos locales.

**Salida esperada:**
```text
Updating abc1234..def5678
Fast-forward
 src/components/ui/ContactWidget.tsx | 10 +++++-----
 1 file changed, 5 insertions(+), 5 deletions(-)
```

> Si dice `Already up to date`, el servidor ya tiene la última versión. Verifica que el `git push` desde tu PC se completó correctamente.

---

### B.4 — Reconstruir y reiniciar el contenedor

```bash
docker-compose up -d --build
```

**Qué hace:**
- `--build` → Vuelve a compilar la imagen con el nuevo código que acabas de bajar.
- `-d` → Lo deja corriendo en segundo plano.
- `up` → Reinicia el contenedor con la nueva imagen.

**Salida esperada:**
```text
[+] Building ...
[+] Running 1/1
 ✔ Container gestorlab_landing  Started
```

---

### B.5 — Verificar que la actualización funcionó

**1. Revisa que el contenedor esté activo:**
```bash
docker-compose ps
```

Debe mostrar `Up` en el estado.

**2. Revisa los logs buscando errores:**
```bash
docker-compose logs --tail=30 landing
```

Si no ves tracebacks ni errores rojos, todo está bien.

**3. Prueba desde tu navegador:**
```
http://IP_PUBLICA_EC2
```

Haz un **refresh forzado** (Ctrl+Shift+R) para limpiar el caché del navegador y ver los cambios nuevos.

---

### B.6 — Limpiar espacio en disco (recomendado)

Cada `--build` deja imágenes Docker viejas ocupando espacio. En una EC2 `t2.micro` (8 GiB) conviene limpiar después de cada actualización:

```bash
docker system prune -f
```

**Qué hace:** Elimina imágenes y capas intermedias que ya no usa ningún contenedor. **No borra** el contenedor en ejecución ni datos.

---

### B.7 — Salir del servidor

```bash
exit
```

Esto cierra la sesión SSH y vuelves a la terminal de tu PC.

---

## 📋 Resumen Rápido (Copiar y Pegar)

### Desde tu PC:
```bash
cd gestorlab-landing
git add .
git commit -m "fix: descripción del cambio"
git push origin main
```

### Desde el servidor AWS (después de conectarte por SSH):
```bash
cd /home/ec2-user/gestorlab-landing
git pull origin main
docker-compose up -d --build
docker-compose ps
docker-compose logs --tail=20 landing
docker system prune -f
```

---

> **Siguiente paso:** [06_APAGAR_SERVICIOS.md](./06_APAGAR_SERVICIOS.md)  
> **Volver al índice:** [00_RESUMEN_GENERAL.md](./00_RESUMEN_GENERAL.md)

