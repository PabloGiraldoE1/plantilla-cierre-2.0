/**
 * Configuración de la integración con Groq.
 *
 * Hay dos formas de conectarse, y basta con llenar UNA:
 *
 * 1. `groqApiKey` — la aplicación llama directamente a la API de Groq.
 *    La clave viaja dentro del bundle publicado, así que cualquiera que
 *    abra la página puede leerla. Úsalo solo si asumes ese riesgo.
 *
 * 2. `groqProxyUrl` — la aplicación llama a un proxy propio (por ejemplo
 *    un Cloudflare Worker) que guarda la clave del lado del servidor.
 *    Es la opción segura: la clave nunca llega al navegador.
 *    Si este campo tiene valor, se ignora `groqApiKey`.
 *
 * Con ambos campos vacíos la función de mejora de texto queda desactivada
 * y el resto de la aplicación sigue funcionando con normalidad.
 */
export const environment = {
  /** Clave de https://console.groq.com/keys — empieza por "gsk_". */
  groqApiKey: '',

  /** URL del proxy propio, p. ej. 'https://mi-worker.midominio.workers.dev'. */
  groqProxyUrl: '',

  /** Modelo de Groq. Ver https://console.groq.com/docs/models */
  groqModelo: 'openai/gpt-oss-20b',
};
