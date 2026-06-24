# Despliegue de la Landing GestorLab (Next.js) en AWS — Resumen General

Esta guía explica **paso a paso** cómo desplegar la landing page de **GestorLab** (construida con Next.js 16 + React 19) en una instancia **AWS EC2** usando **Docker** y **Docker Compose**.

---

## 📋 Flujo General de Despliegue

```
┌─────────────────────────────────────────────────────────────────────┐
│ 1. PREREQUISITOS                                                    │
│    Obtener una API Key de Gemini + tener el backend ya desplegado   │
│                              ↓                                      │
│ 2. CREAR INSTANCIA EC2                                              │
│    Configurar la máquina virtual en la consola de AWS               │
│                              ↓                                      │
│ 3. INSTALAR HERRAMIENTAS EN EL SERVIDOR                             │
│    Git, Docker, Buildx, Docker Compose                              │
│                              ↓                                      │
│ 4. CONFIGURAR ARCHIVOS DEL PROYECTO                                 │
│    Dockerfile, docker-compose.yml, next.config.ts, .env             │
│                              ↓                                      │
│ 5. DESPLEGAR Y VERIFICAR                                            │
│    Clonar repo, construir imagen, levantar contenedor               │
│                              ↓                                      │
│ 6. ACTUALIZAR (cada vez que haya cambios)                           │
│    git push → SSH → git pull → docker-compose up --build            │
│                              ↓                                      │
│ 7. APAGAR SERVICIOS (Evitar facturación)                             │
│    Detener/Terminar instancia y liberar recursos asociados          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Prerequisitos Obligatorios (Antes de Empezar)

Antes de tocar AWS, necesitas tener listos estos elementos:

### 1. Backend de GestorLab ya desplegado
El chatbot de la landing consulta datos reales del backend Django. Necesitas:
- **IP pública del backend** (actualmente: `18.221.224.13`).
- El endpoint `/api/laboratorio/chatbot/context/` debe estar accesible (ver guía de despliegue del backend).

> **¿Qué pasa si el backend no está desplegado?** El chatbot seguirá funcionando usando datos de fallback locales (mock). No se caerá, pero no mostrará datos reales de la base de datos.

### 2. API Key de Google Gemini (para el Chatbot de IA)
El chatbot utiliza la API de **Gemini 2.5 Flash** de Google para generar respuestas inteligentes.

**Cómo obtenerla:**
1. Ve a [Google AI Studio](https://aistudio.google.com/).
2. Inicia sesión con tu cuenta de Google.
3. Ve a **"Get API Key"** → **"Create API Key"**.
4. Copia la clave generada (formato: `AIzaSy...`).
5. **Guárdala en un lugar seguro.** La necesitarás en los pasos 4 y 5.

> **¿Es gratuita?** Sí. Google ofrece un plan gratuito con límites generosos (15 RPM, 1M tokens/min) suficientes para uso académico.

> **¿Es obligatoria?** No. Si no configuras la API Key, el chatbot funcionará con respuestas simuladas basadas en palabras clave. No usará IA real, pero igual responde de forma coherente.

### 3. Cuenta de AWS con acceso a EC2
- Una cuenta de AWS activa (puede ser la capa gratuita *Free Tier*).
- Permisos para crear instancias EC2 y configurar Security Groups.

### 4. Par de claves SSH (`.pem`)
- Si ya tienes un par de claves de otro despliegue (ejemplo: `gestorlab-backend-key.pem`), puedes reutilizarlo.
- Si no, lo crearás en el paso 2 al configurar la instancia EC2.

---

## 📁 Estructura de esta Guía

| Archivo | Contenido |
|---|---|
| `00_RESUMEN_GENERAL.md` | **Este archivo.** Flujo general, prerequisitos y estructura |
| `01_CREAR_INSTANCIA_EC2.md` | Crear y configurar la máquina virtual en AWS |
| `02_INSTALAR_HERRAMIENTAS.md` | Instalar Git, Docker, Buildx y Docker Compose en el servidor |
| `03_CONFIGURAR_PROYECTO.md` | Archivos del proyecto: Dockerfile, docker-compose.yml, variables de entorno |
| `04_DESPLEGAR_Y_VERIFICAR.md` | Clonar, construir, levantar y comprobar que funciona |
| `05_ACTUALIZAR_PRODUCCION.md` | Flujo para subir cambios nuevos desde tu PC al servidor |
| `06_APAGAR_SERVICIOS.md` | Detener/terminar recursos para evitar cobros de AWS |


---

## ⚙️ Stack Tecnológico del Proyecto

| Componente | Tecnología | Versión |
|---|---|---|
| Framework | Next.js | 16.2.9 |
| Librería UI | React | 19.2.4 |
| Lenguaje | TypeScript | 5.x |
| Chatbot IA | Google Gemini API | 2.5 Flash |
| Contenedor | Docker + Docker Compose | Latest |
| Servidor | AWS EC2 (Amazon Linux 2023) | t2.micro |

---

> **Siguiente paso:** Continúa con [01_CREAR_INSTANCIA_EC2.md](./01_CREAR_INSTANCIA_EC2.md)
