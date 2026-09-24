import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

/** Error de la mejora de texto, ya traducido para mostrarse al analista. */
export class GroqError extends Error {
  constructor(
    message: string,
    readonly codigo: 'sin-configurar' | 'clave' | 'limite' | 'red' | 'tiempo' | 'respuesta',
  ) {
    super(message);
    this.name = 'GroqError';
  }
}

const URL_GROQ = 'https://api.groq.com/openai/v1/chat/completions';
const TIEMPO_MAXIMO_MS = 20000;
const LARGO_MAXIMO = 4000;

const INSTRUCCIONES = [
  'Eres un editor técnico de una mesa de servicio de seguros.',
  'Reescribe la descripción de la solución de un incidente para que quede clara,',
  'profesional y bien redactada, lista para enviarse al usuario final.',
  '',
  'Reglas estrictas:',
  '- No inventes información: no agregues causas, fechas, sistemas ni acciones que no estén en el texto original.',
  '- Conserva intactos los datos técnicos: códigos, números de HU, nombres de aplicativos, colas, servicios y siglas.',
  '- Corrige ortografía, tildes, puntuación y gramática.',
  '- Usa un tono formal e impersonal, en pasado ("se identificó", "se aplicó", "se validó").',
  '- Escribe en español de Colombia, entre 1 y 2 párrafos, sin viñetas ni encabezados.',
  '- No agregues saludos, despedidas ni frases de cierre: eso lo añade la plantilla.',
  '- Si el texto original está vacío o no describe una solución, devuélvelo tal cual.',
  '',
  'Responde ÚNICAMENTE con el texto reescrito, sin comillas ni comentarios.',
].join('\n');

/**
 * Mejora la redacción de textos usando la API de Groq.
 *
 * Funciona de dos maneras según `environment`: llamando directamente a Groq
 * con una clave incluida en el bundle, o llamando a un proxy propio que
 * guarda la clave del lado del servidor.
 */
@Injectable({ providedIn: 'root' })
export class GroqService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  /** Indica si hay credenciales configuradas para usar la mejora de texto. */
  get estaConfigurado(): boolean {
    return !!(environment.groqProxyUrl || environment.groqApiKey);
  }

  /**
   * Devuelve el texto reescrito.
   * @throws GroqError con un mensaje ya listo para mostrar al usuario.
   */
  async mejorarTexto(texto: string): Promise<string> {
    if (!this.isBrowser) {
      throw new GroqError('La mejora de texto solo está disponible en el navegador.', 'red');
    }

    if (!this.estaConfigurado) {
      throw new GroqError(
        'La mejora con IA no está configurada. Revisa src/environments/environment.ts',
        'sin-configurar',
      );
    }

    const original = texto.trim();
    if (!original) {
      throw new GroqError('Escribe la solución antes de mejorarla.', 'respuesta');
    }

    const recortado = original.slice(0, LARGO_MAXIMO);
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), TIEMPO_MAXIMO_MS);

    try {
      const respuesta = await fetch(this.url(), {
        method: 'POST',
        headers: this.cabeceras(),
        signal: controlador.signal,
        body: JSON.stringify({
          model: environment.groqModelo,
          temperature: 0.3,
          max_completion_tokens: 1200,
          messages: [
            { role: 'system', content: INSTRUCCIONES },
            { role: 'user', content: recortado },
          ],
        }),
      });

      if (!respuesta.ok) {
        throw this.traducirEstado(respuesta.status);
      }

      const datos: unknown = await respuesta.json();
      const mejorado = this.extraerContenido(datos);

      if (!mejorado) {
        throw new GroqError('El servicio no devolvió texto. Inténtalo de nuevo.', 'respuesta');
      }

      return mejorado;
    } catch (error) {
      if (error instanceof GroqError) throw error;

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new GroqError('El servicio tardó demasiado en responder.', 'tiempo');
      }

      throw new GroqError('No se pudo conectar con el servicio de mejora de texto.', 'red');
    } finally {
      clearTimeout(temporizador);
    }
  }

  private url(): string {
    return environment.groqProxyUrl ? environment.groqProxyUrl.replace(/\/$/, '') : URL_GROQ;
  }

  private cabeceras(): Record<string, string> {
    const cabeceras: Record<string, string> = { 'Content-Type': 'application/json' };
    // Con proxy la clave la pone el servidor: no debe salir del navegador.
    if (!environment.groqProxyUrl) {
      cabeceras['Authorization'] = `Bearer ${environment.groqApiKey}`;
    }
    return cabeceras;
  }

  private traducirEstado(estado: number): GroqError {
    if (estado === 401 || estado === 403) {
      return new GroqError('La clave de Groq no es válida o fue revocada.', 'clave');
    }
    if (estado === 429) {
      return new GroqError(
        'Se alcanzó el límite gratuito de Groq. Intenta de nuevo en unos minutos.',
        'limite',
      );
    }
    return new GroqError(`El servicio respondió con un error (${estado}).`, 'red');
  }

  private extraerContenido(datos: unknown): string {
    if (typeof datos !== 'object' || datos === null) return '';

    const opciones = (datos as { choices?: unknown }).choices;
    if (!Array.isArray(opciones) || opciones.length === 0) return '';

    const mensaje = (opciones[0] as { message?: { content?: unknown } }).message;
    const contenido = mensaje?.content;

    return typeof contenido === 'string' ? contenido.trim() : '';
  }
}
