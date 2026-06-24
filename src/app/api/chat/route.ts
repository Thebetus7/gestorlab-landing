import { NextResponse } from 'next/server';

// Datos estáticos de fallback en caso de que el backend de producción no responda
const MOCK_CONTEXT = `INFORMACIÓN DEL SISTEMA DE GESTORLAB (FALLBACK LOCAL):
Cantidad total de laboratorios activos: 3

- Laboratorio: Laboratorio de Redes y Telecomunicaciones
  Capacidad: 25 personas
  Distribución: 5 filas x 5 columnas
  Accesorios disponibles: Router Cisco, Switch Catalyst, Aire Acondicionado, Proyector Epson
  Máquinas instaladas: 24

- Laboratorio: Laboratorio de Desarrollo de Software (Lab 2)
  Capacidad: 30 personas
  Distribución: 6 filas x 5 columnas
  Accesorios disponibles: Pizarra acrílica, Proyector HD, Aire Acondicionado, Servidor de pruebas
  Máquinas instaladas: 28

- Laboratorio: Laboratorio de Hardware y Robótica (Lab 3)
  Capacidad: 20 personas
  Distribución: 4 filas x 5 columnas
  Accesorios disponibles: Osciloscopio, Cautines, Kits Arduino/Raspberry Pi, Aire Acondicionado
  Máquinas instaladas: 18

INSTRUCCIONES ADICIONALES:
El sistema GestorLab permite a los auxiliares y docentes registrar reservas, reportar incidencias de hardware o software y gestionar el inventario de cada laboratorio. El acceso a la plataforma es mediante el botón 'Ingresar al Sistema' en la landing.`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'El mensaje es requerido' }, { status: 400 });
    }

    // 1. Obtener contexto del backend en producción con un timeout de seguridad de 3.5 segundos
    let systemContext = MOCK_CONTEXT;
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3500);

      const backendUrl = process.env.BACKEND_API_URL || 'http://18.221.224.13';
      const contextRes = await fetch(`${backendUrl}/api/laboratorio/chatbot/context/`, {
        signal: controller.signal,
        next: { revalidate: 60 } // Cachear por 60 segundos
      });
      
      clearTimeout(id);

      if (contextRes.ok) {
        const data = await contextRes.json();
        if (data.context) {
          systemContext = data.context;
        }
      }
    } catch (err) {
      console.warn('No se pudo conectar al backend en producción, usando contexto fallback local.', err);
    }

    // 2. Obtener la API Key de Gemini
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      // RESPUESTA SIMULADA INTELIGENTE SI NO HAY API KEY CONFIGURADA (Para facilidad de pruebas académicas)
      console.info('GEMINI_API_KEY no configurada. Respondiendo con asistente simulado.');
      
      const queryLower = message.toLowerCase();
      let responseText = "Hola, soy el asistente virtual de GestorLab. ¿En qué puedo ayudarte?";

      if (queryLower.includes('laboratorio') || queryLower.includes('cuantos') || queryLower.includes('cuáles') || queryLower.includes('cuales')) {
        responseText = `Actualmente en GestorLab contamos con laboratorios configurados como el Laboratorio de Redes y Telecomunicaciones, el Laboratorio de Desarrollo de Software (Lab 2), y el Laboratorio de Hardware y Robótica. ¿Te gustaría saber el detalle o capacidad de alguno de ellos?`;
      } else if (queryLower.includes('capacidad') || queryLower.includes('personas') || queryLower.includes('cuantos entran')) {
        responseText = `El Laboratorio de Redes tiene capacidad para 25 personas (24 máquinas), el de Desarrollo de Software para 30 personas (28 máquinas), y el de Hardware para 20 personas (18 máquinas).`;
      } else if (queryLower.includes('reserva') || queryLower.includes('reservar')) {
        responseText = `Para realizar una reserva en algún laboratorio, debes iniciar sesión en la plataforma GestorLab haciendo clic en 'Ingresar al Sistema' en la parte superior derecha de esta página, ir al módulo de Reservas y seleccionar el laboratorio, fecha y horario de tu interés.`;
      } else if (queryLower.includes('incidencia') || queryLower.includes('falla') || queryLower.includes('reportar')) {
        responseText = `Si detectas un problema o falla en algún equipo (hardware, software o red), puedes reportarlo directamente ingresando a la aplicación de GestorLab y completando el formulario de reporte de incidencias en el menú principal.`;
      } else if (queryLower.includes('hola') || queryLower.includes('buenos dias') || queryLower.includes('buenas tardes')) {
        responseText = `¡Hola! Soy el asistente virtual de GestorLab. Estoy aquí para responder tus preguntas sobre los laboratorios, equipos y reservas del sistema Nexa Core. ¿Qué deseas consultar hoy?`;
      } else {
        responseText = `Entiendo tu consulta sobre "${message}". Como asistente académico de GestorLab, te comento que nuestro sistema permite gestionar el inventario de laboratorios, reservas e incidencias en tiempo real. Si configuras la variable de entorno GEMINI_API_KEY, podré responder de manera 100% libre mediante Inteligencia Artificial real.`;
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
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
    }

    // Añadimos el mensaje actual incluyendo el contexto de la base de datos como instrucción de sistema
    const promptWithContext = `Eres el asistente virtual interactivo oficial de la plataforma GestorLab desarrollada por Nexa Core. 
Responde de manera amigable, profesional y concisa a las dudas de los usuarios utilizando los siguientes datos reales del sistema obtenidos de la base de datos de producción:

${systemContext}

Historial de la conversación y/o dudas adicionales del usuario a resolver:
Mensaje del usuario: ${message}`;

    formattedContents.push({
      role: 'user',
      parts: [{ text: promptWithContext }]
    });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: formattedContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    if (!geminiRes.ok) {
      const errorData = await geminiRes.json();
      throw new Error(errorData.error?.message || 'Error al consultar Gemini API');
    }

    const geminiData = await geminiRes.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude procesar tu solicitud.';

    return NextResponse.json({ response: responseText });

  } catch (error: any) {
    console.error('Error en el chatbot API handler:', error);
    return NextResponse.json({ error: 'Ocurrió un error al procesar tu solicitud: ' + error.message }, { status: 500 });
  }
}
