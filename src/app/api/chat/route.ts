import { NextResponse } from "next/server";

// Datos estáticos de fallback en caso de que el backend de producción no responda
const MOCK_CONTEXT = `INFORMACIÓN INSTITUCIONAL DE NEXACORE TECH Y LA PLATAFORMA NEXACORE:

1. SOBRE LA EMPRESA (NEXACORE TECH):
- Nombre de la Empresa: NexaCore Tech.
- Origen: Fundada por estudiantes de la UAGRM en Santa Cruz de la Sierra, Bolivia.
- Slogan: "Desarrollo ágil para un mundo conectado."
- Misión: Liderar la industria del desarrollo de software con soluciones tecnológicas de alta calidad.
- Equipo de Desarrollo (Propietarios):
  * Edberto Ybanera Herrera (Scrum Master & Developer) - Registro: 219059829. Correo: edybanera@gmail.com. Celular: +591 77389330.
  * Juan Noe Jarpa Muñoz (Product Owner & Developer) - Registro: 219068887. Correo: juan.noe.jarpa.18@gmail.com. Celular: +591 71064272.
- Docente Supervisor: Ing. Rolando Martínez.

2. SOBRE EL PRODUCTO (NEXACORE):
- Descripción: Sistema Web y Móvil para la gestión automatizada de laboratorios de computación (diseñado para la F.I.C.C.T. de la UAGRM).
- Módulos Principales:
  * Control de Asistencia Digital: Registro mediante geocercas (GPS) y código QR para auxiliares.
  * Gestión de Reservas en Tiempo Real: Calendario interactivo con validación de disponibilidad y sincronización con Google Calendar.
  * Matriz Física de PCs e Incidencias: Permite reportar fallas en computadoras directamente sobre una matriz visual en la app móvil.
  * Asistente Inteligente (IA): Chatbot conversacional para soporte y comandos por lenguaje natural.
  * Business Intelligence (BI): Dashboards gráficos con métricas de ocupación, asistencia y resolución de incidencias.

3. ARQUITECTURA TÉCNICA:
- Backend: Python con Django y base de datos PostgreSQL (con soporte para geocercas/GPS).
- Frontend Web: Next.js (React) con TypeScript.
- Frontend Móvil: Flutter (Dart) para Android/iOS.
- APIs e Integraciones: Google Location (GPS), Google Gemini (IA), Google Calendar (Reservas) y Firebase Cloud Messaging (Notificaciones Push).

4. COSTOS Y MONETIZACIÓN (B2B SAAS):
- Setup Inicial e Implementación: $2,500 USD (35,000 Bs) pago único por institución (instalación, geocercas y carga de catálogo).
- Suscripción Mensual (Plan Profesional): $300 USD / mes (3,500 Bs / mes) (incluye laboratorios ilimitados, acceso a BI y soporte técnico 24/7).
- Capacitaciones: $500 USD anual/presencial.`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "El mensaje es requerido" },
        { status: 400 },
      );
    }

    // 1. Obtener contexto del backend en producción con un timeout de seguridad de 3.5 segundos
    let systemContext = MOCK_CONTEXT;
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3500);

      const backendUrl = process.env.BACKEND_API_URL || "http://18.221.224.13";
      const contextRes = await fetch(
        `${backendUrl}/api/laboratorio/chatbot/context/`,
        {
          signal: controller.signal,
          next: { revalidate: 60 }, // Cachear por 60 segundos
        },
      );

      clearTimeout(id);

      if (contextRes.ok) {
        const data = await contextRes.json();
        if (data.context) {
          systemContext = data.context;
        }
      }
    } catch (err) {
      console.warn(
        "No se pudo conectar al backend en producción, usando contexto fallback local.",
        err,
      );
    }

    // 2. Obtener la API Key de Gemini
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      // RESPUESTA SIMULADA INTELIGENTE SI NO HAY API KEY CONFIGURADA (Para facilidad de pruebas académicas)
      console.info(
        "GEMINI_API_KEY no configurada. Respondiendo con asistente simulado.",
      );

      const queryLower = message.toLowerCase();
      let responseText =
        "Hola, soy el asistente virtual de NEXACORE. ¿En qué puedo ayudarte?";

      if (
        queryLower.includes("laboratorio") ||
        queryLower.includes("cuantos") ||
        queryLower.includes("cuáles") ||
        queryLower.includes("cuales")
      ) {
        responseText = `Actualmente en NEXACORE contamos con laboratorios configurados como el Laboratorio de Redes y Telecomunicaciones, el Laboratorio de Desarrollo de Software (Lab 2), y el Laboratorio de Hardware y Robótica. ¿Te gustaría saber el detalle o capacidad de alguno de ellos?`;
      } else if (
        queryLower.includes("capacidad") ||
        queryLower.includes("personas") ||
        queryLower.includes("cuantos entran")
      ) {
        responseText = `El Laboratorio de Redes tiene capacidad para 25 personas (24 máquinas), el de Desarrollo de Software para 30 personas (28 máquinas), y el de Hardware para 20 personas (18 máquinas).`;
      } else if (
        queryLower.includes("reserva") ||
        queryLower.includes("reservar")
      ) {
        responseText = `Para realizar una reserva en algún laboratorio, debes iniciar sesión en la plataforma NEXACORE haciendo clic en 'Ingresar al Sistema' en la parte superior derecha de esta página, ir al módulo de Reservas y seleccionar el laboratorio, fecha y horario de tu interés.`;
      } else if (
        queryLower.includes("incidencia") ||
        queryLower.includes("falla") ||
        queryLower.includes("reportar")
      ) {
        responseText = `Si detectas un problem o falla en algún equipo (hardware, software o red), puedes reportarlo directamente ingresando a la aplicación de NEXACORE y completando el formulario de reporte de incidencias en el menú principal.`;
      } else if (
        queryLower.includes("hola") ||
        queryLower.includes("buenos dias") ||
        queryLower.includes("buenas tardes")
      ) {
        responseText = `¡Hola! Soy el asistente virtual de NEXACORE. Estoy aquí para responder tus preguntas sobre los laboratorios, equipos y reservas del sistema Nexa Core. ¿Qué deseas consultar hoy?`;
      } else {
        responseText = `Entiendo tu consulta sobre "${message}". Como asistente académico de NEXACORE, te comento que nuestro sistema permite gestionar el inventario de laboratorios, reservas e incidencias en tiempo real. Si configuras la variable de entorno GEMINI_API_KEY, podré responder de manera 100% libre mediante Inteligencia Artificial real.`;
      }

      return NextResponse.json({ response: responseText });
    }

    // 3. Llamar a la API real de Gemini 2.5 Flash
    // Construimos el historial en el formato esperado por Gemini
    const formattedContents = [];

    // Añadimos historial si existe
    if (Array.isArray(history)) {
      history.forEach((msg: { role: string; content: string }) => {
        formattedContents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        });
      });
    }

    // Eres el asistente virtual oficial del proyecto.
    const promptWithContext = `Eres el asistente virtual interactivo oficial de la plataforma NEXACORE desarrollada por la empresa NexaCore Tech. 
Responde de manera amigable, profesional, atenta y concisa a las consultas de los usuarios utilizando los siguientes datos corporativos e institucionales oficiales:

${systemContext}

Directrices para tus respuestas:
1. Responde en representación de la empresa NexaCore Tech.
2. Si te preguntan cosas técnicas o documentales (como frameworks, lenguajes, base de datos, dueños/autores, costos o servicios), responde de forma precisa usando los datos institucionales anteriores.
3. Mantén un tono formal pero cercano. Responde siempre en español, utilizando términos técnicos tradicionales en inglés cuando aplique.
4. Si la pregunta está fuera del alcance de la información provista, redirige amablemente al usuario a los contactos oficiales (Edberto Ybanera al +591 77389330 o Juan Noe Jarpa al +591 71064272).

Historial de la conversación y/o dudas adicionales del usuario a resolver:
Mensaje del usuario: ${message}`;

    formattedContents.push({
      role: "user",
      parts: [{ text: promptWithContext }],
    });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: formattedContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errorData = await geminiRes.json();
      throw new Error(
        errorData.error?.message || "Error al consultar Gemini API",
      );
    }

    const geminiData = await geminiRes.json();
    const responseText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No pude procesar tu solicitud.";

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error("Error en el chatbot API handler:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar tu solicitud: " + error.message },
      { status: 500 },
    );
  }
}
