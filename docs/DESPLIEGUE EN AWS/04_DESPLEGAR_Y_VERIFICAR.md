# Paso 4: Desplegar y Verificar

Con la instancia EC2 lista, las herramientas instaladas y los archivos del proyecto configurados, es momento de clonar el código, construir la imagen Docker y levantar la landing en producción.

> [!IMPORTANT]
> Todos los comandos de esta sección se ejecutan **dentro del servidor AWS** (conectado por SSH). No en tu PC.

---

## 4.1 — Subir los Cambios desde tu PC a GitHub

Antes de clonar en el servidor, asegúrate de que tu repositorio en GitHub tiene el código más reciente, incluyendo el `Dockerfile` y `docker-compose.yml`:

**En tu PC (PowerShell o terminal):**
```bash
cd gestorlab-landing
git add .
git commit -m "feat: agregar Dockerfile y docker-compose.yml para despliegue AWS"
git push origin main
```

---

## 4.2 — Clonar el Repositorio en la EC2

**En el servidor AWS (SSH):**

```bash
cd /home/ec2-user
git clone <URL_DE_TU_REPOSITORIO_GITHUB> gestorlab-landing
cd gestorlab-landing
```

> Reemplaza `<URL_DE_TU_REPOSITORIO_GITHUB>` con la URL real de tu repo (ejemplo: `https://github.com/tu-usuario/gestorlab-landing.git`).

**Verifica que el contenido está correcto:**
```bash
ls
```

Deberías ver archivos como: `Dockerfile`, `docker-compose.yml`, `package.json`, `src/`, `next.config.ts`, etc.

---

## 4.3 — Configurar tu API Key de Gemini en el Servidor

Antes de construir, edita el `docker-compose.yml` en el servidor para poner tu API Key real de Gemini:

```bash
nano docker-compose.yml
```

Busca la línea:
```yaml
- GEMINI_API_KEY=REEMPLAZA_CON_TU_API_KEY_REAL
```

Reemplázala con tu clave real:
```yaml
- GEMINI_API_KEY=AIzaSy_tu_clave_real_aqui
```

Guarda el archivo: `Ctrl+O` → `Enter` → `Ctrl+X`.

> [!TIP]
> Este cambio es **solo en el servidor**, no en tu PC. El `docker-compose.yml` de tu PC puede tener un placeholder o estar vacío. Así evitas subir credenciales a GitHub.

---

## 4.4 — Construir la Imagen y Levantar el Contenedor

```bash
docker-compose up -d --build
```

**Qué hace cada parte:**
- `up` → Crea y levanta los contenedores definidos en `docker-compose.yml`.
- `-d` → Los ejecuta en segundo plano (no bloquea la terminal).
- `--build` → Reconstruye la imagen Docker con el código actual.

**Primera vez será lento** (~3-5 minutos) porque descarga la imagen de Node.js, instala dependencias y compila Next.js. Las siguientes veces serán mucho más rápidas gracias al caché de Docker.

**Salida esperada si todo va bien:**
```text
[+] Building ...
[+] Running 1/1
 ✔ Container gestorlab_landing  Started
```

---

## 4.5 — Verificar que la Landing Está en Línea

### Verificación 1: Estado del contenedor
```bash
docker-compose ps
```

**Salida esperada:**
```text
NAME                  STATUS      PORTS
gestorlab_landing     Up          0.0.0.0:80->3000/tcp
```

El estado debe decir `Up`. Si dice `Restarting` o `Exit`, algo falló.

### Verificación 2: Probar desde el servidor
```bash
curl -I http://localhost
```

**Salida esperada:**
```text
HTTP/1.1 200 OK
```

### Verificación 3: Probar desde tu navegador
Abre tu navegador y visita:
```
http://IP_PUBLICA_EC2
```

Deberías ver la landing de GestorLab/Nexacore cargando correctamente.

### Verificación 4: Probar el chatbot
1. Haz clic en la burbuja flotante del chatbot (la de la izquierda con el ícono circular).
2. Escribe: "¿Qué laboratorios hay disponibles?"
3. Deberías recibir una respuesta (real de Gemini si configuraste la API Key, o simulada si no).

---

## ⚠️ Solución de Problemas

### El contenedor está en estado `Restarting`
Revisa los logs para ver el error:
```bash
docker-compose logs --tail=50 landing
```

**Errores comunes:**

| Error | Causa | Solución |
|---|---|---|
| `ENOENT: no such file or directory, open '.next/...'` | Falta `output: 'standalone'` en `next.config.ts` | Agrega la opción según el paso 3.2 y reconstruye |
| `compose build requires buildx 0.17.0` | Buildx desactualizado | Sigue la sección 2.2 de la guía de herramientas |
| `npm ci` falla con errores de paquetes | `package-lock.json` desactualizado | En tu PC, ejecuta `npm install` y sube el `package-lock.json` actualizado |

### La página carga pero el chatbot no responde
1. Revisa que la variable `GEMINI_API_KEY` esté configurada correctamente en `docker-compose.yml`.
2. Si no pusiste API Key, el chatbot responderá con respuestas simuladas (esto es normal, no es un error).
3. Si el chatbot no responde nada, revisa los logs: `docker-compose logs --tail=30 landing`.

### No puedo acceder desde el navegador
1. Verifica que el Security Group de la EC2 tiene abierto el **puerto 80** (HTTP).
2. Verifica que el contenedor está corriendo: `docker-compose ps`.
3. Verifica que no hay un firewall de la EC2 bloqueando: `sudo iptables -L -n`.

---

> **Siguiente paso:** Continúa con [05_ACTUALIZAR_PRODUCCION.md](./05_ACTUALIZAR_PRODUCCION.md)
