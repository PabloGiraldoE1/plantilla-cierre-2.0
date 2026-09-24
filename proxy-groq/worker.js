/**
 * Proxy opcional para la API de Groq (Cloudflare Worker).
 *
 * Sirve para que la clave de Groq NO viaje dentro del bundle de la
 * aplicación: vive aquí, como secreto del Worker.
 *
 * Despliegue (una sola vez):
 *   1. npm install -g wrangler && wrangler login
 *   2. wrangler deploy            (desde esta carpeta)
 *   3. wrangler secret put GROQ_API_KEY   y pega la clave gsk_...
 *   4. Copia la URL que imprime wrangler en environment.groqProxyUrl
 *
 * ORIGENES_PERMITIDOS limita quién puede usar el proxy. Ajusta la lista
 * con el dominio donde publicas la aplicación.
 */

const ORIGENES_PERMITIDOS = [
  'https://juanpge123.github.io',
  'http://localhost:4200',
  'http://localhost:4300',
];

const URL_GROQ = 'https://api.groq.com/openai/v1/chat/completions';

export default {
  async fetch(request, env) {
    const origen = request.headers.get('Origin') || '';
    const permitido = ORIGENES_PERMITIDOS.includes(origen);
    const cors = {
      'Access-Control-Allow-Origin': permitido ? origen : ORIGENES_PERMITIDOS[0],
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Método no permitido' }, 405, cors);
    }

    if (!permitido) {
      return json({ error: 'Origen no autorizado' }, 403, cors);
    }

    let cuerpo;
    try {
      cuerpo = await request.json();
    } catch {
      return json({ error: 'Cuerpo inválido' }, 400, cors);
    }

    // Solo se reenvían los campos esperados: el proxy no es una pasarela abierta.
    const carga = {
      model: cuerpo.model,
      messages: cuerpo.messages,
      temperature: cuerpo.temperature ?? 0.3,
      max_completion_tokens: Math.min(cuerpo.max_completion_tokens ?? 1200, 2000),
    };

    const respuesta = await fetch(URL_GROQ, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(carga),
    });

    return new Response(respuesta.body, {
      status: respuesta.status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  },
};

function json(datos, estado, cors) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
