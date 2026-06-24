# Paso 1: Crear la Instancia EC2 en AWS

Esta sección describe cómo crear la máquina virtual donde correrá tu landing de Next.js.

---

## 1.1 — Acceder a la Consola de AWS

1. Ve a [console.aws.amazon.com](https://console.aws.amazon.com/).
2. Inicia sesión con tu cuenta de AWS.
3. En la barra de búsqueda superior, escribe **EC2** y selecciona el servicio.
4. Haz clic en **"Lanzar instancia"** (Launch Instance).

---

## 1.2 — Configurar la Instancia

| Parámetro | Valor |
|---|---|
| **Nombre** | `gestorlab-landing` |
| **AMI** | Amazon Linux 2023 AMI (capa gratuita) |
| **Tipo de Instancia** | `t2.micro` o `t3.micro` (capa gratuita) |
| **Almacenamiento** | `8 GiB gp3` (suficiente para Docker + Next.js) |

---

## 1.3 — Par de Claves SSH

El par de claves te permite conectarte al servidor desde tu computadora vía SSH.

**Si ya tienes un par de claves** (por ejemplo, de la instancia del backend):
- Selecciona el par existente en el desplegable (ej: `gestorlab-backend-key`).

**Si necesitas crear uno nuevo:**
1. Haz clic en **"Crear un nuevo par de claves"**.
2. Configúralo:
   - **Nombre:** `gestorlab-landing-key`
   - **Tipo de clave:** RSA
   - **Formato de archivo:** `.pem`
3. Presiona **Crear**. Tu navegador descargará automáticamente el archivo `gestorlab-landing-key.pem`.

> [!CAUTION]
> **Guarda el archivo `.pem` en un lugar seguro.** Si lo pierdes, no podrás conectarte al servidor por SSH y tendrás que crear una nueva instancia.

---

## 1.4 — Configurar el Security Group (Reglas de Red)

El Security Group controla qué puertos están abiertos en tu servidor. Para la landing necesitas:

| Tipo | Protocolo | Puerto | Origen | Propósito |
|---|---|---|---|---|
| SSH | TCP | 22 | `0.0.0.0/0` | Conectarte desde tu PC por terminal |
| HTTP | TCP | 80 | `0.0.0.0/0` | Servir la página web al mundo |

**Cómo configurarlo:**
1. En "Configuraciones de red", haz clic en **"Editar"**.
2. Marca la casilla **"Permitir tráfico SSH desde"** → Cualquier lugar.
3. Marca la casilla **"Permitir tráfico HTTP desde"** → Cualquier lugar.

---

## 1.5 — Lanzar la Instancia

1. Revisa el resumen de configuración.
2. Haz clic en **"Lanzar instancia"**.
3. Espera ~1 minuto a que el estado cambie a **"En ejecución"** (Running).
4. **Anota la IP pública** que aparece en el panel de la instancia (ejemplo: `3.15.42.78`). La usarás para conectarte por SSH y para acceder a la landing desde el navegador.

---

## 1.6 — Conectarte por SSH

Desde tu PC, abre una terminal y conéctate:

**En Windows (PowerShell):**
```powershell
cd C:\ruta\donde\guardaste\la\clave
ssh -i gestorlab-landing-key.pem ec2-user@IP_PUBLICA_EC2
```

**En Linux/Mac:**
```bash
ssh -i gestorlab-landing-key.pem ec2-user@IP_PUBLICA_EC2
```

> Reemplaza `IP_PUBLICA_EC2` por la IP que anotaste en el paso anterior.

**Si la conexión es exitosa**, verás un prompt como:
```text
[ec2-user@ip-172-31-41-220 ~]$
```

Eso significa que **ya estás dentro del servidor**. Todo lo que escribas se ejecuta en AWS, no en tu PC.

---

> **Siguiente paso:** Continúa con [02_INSTALAR_HERRAMIENTAS.md](./02_INSTALAR_HERRAMIENTAS.md)
