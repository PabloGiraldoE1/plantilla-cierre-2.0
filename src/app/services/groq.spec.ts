import { TestBed } from '@angular/core/testing';
import { GroqError, GroqService } from './groq';
import { environment } from '../../environments/environment';

describe('GroqService', () => {
  let servicio: GroqService;
  const fetchOriginal = globalThis.fetch;
  const claveOriginal = environment.groqApiKey;
  const proxyOriginal = environment.groqProxyUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(GroqService);
    environment.groqApiKey = 'gsk_prueba';
    environment.groqProxyUrl = '';
  });

  afterEach(() => {
    globalThis.fetch = fetchOriginal;
    environment.groqApiKey = claveOriginal;
    environment.groqProxyUrl = proxyOriginal;
  });

  function responder(cuerpo: unknown, ok = true, status = 200): void {
    globalThis.fetch = (() =>
      Promise.resolve({
        ok,
        status,
        json: () => Promise.resolve(cuerpo),
      })) as unknown as typeof fetch;
  }

  it('devuelve el texto reescrito', async () => {
    responder({ choices: [{ message: { content: '  Se aplicó la solución.  ' } }] });

    await expect(servicio.mejorarTexto('se aplico la solucion')).resolves.toBe(
      'Se aplicó la solución.',
    );
  });

  it('envía la clave en la cabecera cuando no hay proxy', async () => {
    let cabeceras: Record<string, string> = {};
    globalThis.fetch = ((_url: string, opciones: RequestInit) => {
      cabeceras = opciones.headers as Record<string, string>;
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ choices: [{ message: { content: 'listo' } }] }),
      });
    }) as unknown as typeof fetch;

    await servicio.mejorarTexto('texto');

    expect(cabeceras['Authorization']).toBe('Bearer gsk_prueba');
  });

  it('no expone la clave cuando se usa un proxy', async () => {
    environment.groqProxyUrl = 'https://proxy.ejemplo.dev';
    let cabeceras: Record<string, string> = {};
    let urlLlamada = '';
    globalThis.fetch = ((url: string, opciones: RequestInit) => {
      urlLlamada = url;
      cabeceras = opciones.headers as Record<string, string>;
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ choices: [{ message: { content: 'listo' } }] }),
      });
    }) as unknown as typeof fetch;

    await servicio.mejorarTexto('texto');

    expect(urlLlamada).toBe('https://proxy.ejemplo.dev');
    expect(cabeceras['Authorization']).toBeUndefined();
  });

  it('traduce el límite de peticiones a un mensaje entendible', async () => {
    responder({}, false, 429);

    await expect(servicio.mejorarTexto('texto')).rejects.toMatchObject({
      codigo: 'limite',
    });
  });

  it('traduce una clave inválida', async () => {
    responder({}, false, 401);

    await expect(servicio.mejorarTexto('texto')).rejects.toMatchObject({ codigo: 'clave' });
  });

  it('rechaza texto vacío sin llamar a la red', async () => {
    let llamadas = 0;
    globalThis.fetch = (() => {
      llamadas++;
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) });
    }) as unknown as typeof fetch;

    await expect(servicio.mejorarTexto('   ')).rejects.toBeInstanceOf(GroqError);
    expect(llamadas).toBe(0);
  });

  it('avisa cuando no hay credenciales configuradas', async () => {
    environment.groqApiKey = '';
    environment.groqProxyUrl = '';

    await expect(servicio.mejorarTexto('texto')).rejects.toMatchObject({
      codigo: 'sin-configurar',
    });
  });
});
