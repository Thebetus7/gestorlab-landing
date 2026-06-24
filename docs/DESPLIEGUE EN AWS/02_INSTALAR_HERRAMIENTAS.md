# Paso 2: Instalar Herramientas en el Servidor EC2

Antes de desplegar tu proyecto Next.js, el servidor EC2 de Amazon Linux 2023 necesita tener instaladas estas herramientas. **Ejecuta todos estos comandos dentro del servidor** (después de conectarte por SSH).

---

## ¿Qué se necesita instalar y por qué?

| Herramienta | ¿Para qué? | ¿Viene pre-instalada en EC2? |
|---|---|---|
| **Git** | Clonar y actualizar tu código desde GitHub | ❌ No |
| **Docker** | Empaquetar tu app Next.js en un contenedor aislado y portable | ❌ No |
| **Docker Buildx** | Construir imágenes Docker modernas (requerido por Compose) | ❌ No (la versión que instala Amazon es obsoleta) |
| **Docker Compose** | Orquestar el contenedor con variables de entorno y configuración de puertos | ❌ No |

> [!IMPORTANT]
> **¿Node.js? ¿npm? ¿No necesito instalarlos?**
> **No.** Docker se encarga de todo. La imagen `node:18-alpine` del `Dockerfile` ya incluye Node.js 18 y npm. Tu servidor EC2 solo necesita Docker para construir y ejecutar el contenedor. Esto simplifica enormemente la configuración del servidor.

---

## 2.1 — Instalar Git y Docker

```bash
# Actualizar el sistema operativo
sudo dnf update -y

# Instalar Git (para clonar el código) y Docker (para contenedores)
sudo dnf install docker git -y

# Iniciar el servicio de Docker y habilitarlo para que arranque automáticamente al reiniciar el servidor
sudo systemctl start docker
sudo systemctl enable docker

# Permitir que el usuario ec2-user use Docker sin necesidad de 'sudo' delante de cada comando
sudo usermod -aG docker ec2-user
```

> [!IMPORTANT]
> Para que el permiso de grupo `docker` tome efecto en tu sesión SSH actual, debes:
> 1. Cerrar la sesión SSH con `exit` y volver a conectarte, **o**
> 2. Ejecutar: `newgrp docker`

---

## 2.2 — Instalar Docker Buildx (Obligatorio en Amazon Linux 2023)

Amazon Linux 2023 instala Buildx **0.12.1** por defecto, pero Docker Compose moderno requiere **0.17.0 o superior** para construir imágenes. **Sin este paso, `docker-compose up --build` fallará.**

```bash
# Crear la carpeta de plugins de Docker CLI
sudo mkdir -p /usr/local/lib/docker/cli-plugins

# Descargar Buildx 0.19.3 (versión compatible)
sudo curl -L "https://github.com/docker/buildx/releases/download/v0.19.3/buildx-v0.19.3.linux-amd64" \
  -o /usr/local/lib/docker/cli-plugins/docker-buildx

# Darle permisos de ejecución
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-buildx
```

**Verificar que la versión es correcta:**
```bash
docker buildx version
```

**Salida esperada:**
```text
github.com/docker/buildx v0.19.3 ...
```

**Si aún muestra `0.12.1`**, Docker está usando el Buildx viejo del paquete del sistema. Fuerza el plugin nuevo:

```bash
export DOCKER_CLI_PLUGIN_EXTRA_DIRS=/usr/local/lib/docker/cli-plugins
echo 'export DOCKER_CLI_PLUGIN_EXTRA_DIRS=/usr/local/lib/docker/cli-plugins' >> ~/.bashrc
source ~/.bashrc
docker buildx version
```

> [!CAUTION]
> **No continúes** al siguiente paso si `docker buildx version` sigue mostrando menos de `0.17.0`. Sin esto, `docker-compose up -d --build` fallará con el error:
> `compose build requires buildx 0.17.0 or later`

---

## 2.3 — Instalar Docker Compose

```bash
# Descargar la última versión de Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose

# Darle permisos de ejecución
sudo chmod +x /usr/local/bin/docker-compose
```

---

## 2.4 — Verificación Final (Checklist)

Ejecuta estos tres comandos. **Todos deben responder sin error** antes de continuar:

```bash
docker --version
docker-compose --version
docker buildx version
```

| Comando | Qué validar |
|---|---|
| `docker --version` | Docker instalado correctamente |
| `docker-compose --version` | Compose instalado correctamente |
| `docker buildx version` | Versión **≥ 0.17.0** (ideal: `v0.19.3`) |

**Ejemplo de salida correcta:**
```text
Docker version 25.0.6, build ...
Docker Compose version v2.29.7
github.com/docker/buildx v0.19.3 ...
```

✅ Si los tres responden correctamente, el servidor está listo para recibir el proyecto.

---

> **Siguiente paso:** Continúa con [03_CONFIGURAR_PROYECTO.md](./03_CONFIGURAR_PROYECTO.md)
