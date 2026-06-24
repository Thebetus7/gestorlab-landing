# Paso 3: Configurar Archivos del Proyecto

Para que Docker pueda construir y ejecutar tu landing de Next.js, necesitas crear/modificar estos archivos en la raíz de `gestorlab-landing/`. Estos archivos **sí se suben a Git** (excepto los `.env`).

---

## 📁 Archivos necesarios en la raíz del proyecto

```
gestorlab-landing/
├── Dockerfile              ← Instrucciones para construir la imagen Docker
├── docker-compose.yml      ← Orquestación: puertos, variables de entorno
├── next.config.ts          ← Configuración de Next.js (debe incluir output: 'standalone')
├── .env.local              ← Variables de entorno LOCALES (NO se sube a Git)
├── .gitignore              ← Ya incluye .env.local por defecto
├── package.json
├── src/
│   └── ...
└── ...
```

---

## 3.1 — Variables de Entorno: Local vs Producción

El proyecto utiliza **2 variables de entorno** que cambian según el entorno:

| Variable | Descripción | ¿Obligatoria? |
|---|---|---|
| `BACKEND_API_URL` | URL del servidor Django que provee los datos de laboratorios al chatbot | No (tiene fallback: `http://18.221.224.13`) |
| `GEMINI_API_KEY` | Clave de la API de Google Gemini para respuestas con IA real | No (sin ella, el chatbot usa respuestas simuladas) |

### 💻 En Local: archivo `.env.local`

Crea este archivo en la raíz de `gestorlab-landing/` en tu PC. **No se sube a Git** (está en `.gitignore`).

```env
# Apunta a tu servidor Django local
BACKEND_API_URL=http://localhost:8000

# Tu clave de Google AI Studio para pruebas
GEMINI_API_KEY=AIzaSy_tu_clave_de_desarrollo
```

### ☁️ En Producción (AWS): dentro de `docker-compose.yml`

En el servidor de AWS, las variables **no** se leen de un archivo `.env.local`. Se inyectan directamente al contenedor a través de la sección `environment` del `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - BACKEND_API_URL=http://18.221.224.13    # IP del backend en producción
  - GEMINI_API_KEY=AIzaSy_tu_clave_real      # Tu clave real de Gemini
```

### ¿Cómo funciona internamente?

El código del chatbot en `src/app/api/chat/route.ts` está parametrizado para leer las variables de entorno de forma dinámica. **No necesitas cambiar código entre local y producción**:

```typescript
// Lee la variable del entorno (sea .env.local o Docker)
const backendUrl = process.env.BACKEND_API_URL || 'http://18.221.224.13';
const contextRes = await fetch(`${backendUrl}/api/laboratorio/chatbot/context/`, { ... });
```

```typescript
// Lee la API Key del entorno (sea .env.local o Docker)
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  // Si no hay API Key → respuestas simuladas (no se cae)
  // Si hay API Key → llama a Gemini API real
}
```

---

## 3.2 — Modificar `next.config.ts` (Obligatorio para Docker)

Tu archivo `next.config.ts` actual necesita la opción `output: 'standalone'` para que Docker pueda construir una imagen optimizada. Sin esta opción, el Dockerfile no encontrará los archivos necesarios y el build fallará.

**Antes (sin standalone):**
```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};
```

**Después (con standalone):**
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',  // ← AGREGAR ESTA LÍNEA
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};
```

> [!IMPORTANT]
> La opción `output: 'standalone'` le dice a Next.js que copie **solo** los archivos estrictamente necesarios para ejecutar el servidor de producción. Esto reduce el tamaño del contenedor Docker de ~1GB a ~120MB aproximadamente.

---

## 3.3 — Crear `Dockerfile`

Crea este archivo en la raíz de `gestorlab-landing/`. Usa una estructura de múltiples etapas (*multi-stage build*) para optimizar el tamaño:

```dockerfile
# ── Etapa 1: Instalar Dependencias ──
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Etapa 2: Compilar el Proyecto ──
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Etapa 3: Servidor de Producción (imagen final liviana) ──
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copiar solo los archivos necesarios del build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

**¿Qué hace cada etapa?**

| Etapa | Qué hace | ¿Se incluye en la imagen final? |
|---|---|---|
| `deps` | Instala `node_modules` con `npm ci` (instalación limpia) | ❌ Solo se usa para copiar dependencias |
| `builder` | Compila Next.js (`npm run build`) | ❌ Solo se usa para copiar el resultado |
| `runner` | Ejecuta `node server.js` con los archivos compilados mínimos | ✅ Esta es la imagen que corre en producción |

---

## 3.4 — Crear `docker-compose.yml`

Crea este archivo en la raíz de `gestorlab-landing/`:

```yaml
services:
  landing:
    build: .
    container_name: gestorlab_landing
    restart: always
    ports:
      - "80:3000"  # El puerto 80 del servidor se mapea al 3000 de Next.js
    environment:
      - NODE_ENV=production
      - BACKEND_API_URL=http://18.221.224.13
      - GEMINI_API_KEY=REEMPLAZA_CON_TU_API_KEY_REAL
```

> [!WARNING]
> **Reemplaza** `REEMPLAZA_CON_TU_API_KEY_REAL` con tu API Key real de Gemini. Si no tienes una, puedes dejar la línea vacía (`GEMINI_API_KEY=`) y el chatbot funcionará con respuestas simuladas.

---

## 3.5 — Resumen de diferencias: Local vs Producción

| Aspecto | Local (tu PC) | Producción (AWS) |
|---|---|---|
| Variables de entorno | Archivo `.env.local` | Sección `environment` en `docker-compose.yml` |
| `BACKEND_API_URL` | `http://localhost:8000` | `http://18.221.224.13` |
| `GEMINI_API_KEY` | Tu clave de pruebas | Tu clave real |
| Cómo se ejecuta | `npm run dev` | `docker-compose up -d --build` |
| Código fuente | Cambios sin cambiar código* | Cambios sin cambiar código* |

*\*El código es el mismo en ambos entornos. Las variables de entorno controlan el comportamiento.*

---

> **Siguiente paso:** Continúa con [04_DESPLEGAR_Y_VERIFICAR.md](./04_DESPLEGAR_Y_VERIFICAR.md)
