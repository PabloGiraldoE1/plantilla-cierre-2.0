import { TestBed } from '@angular/core/testing';
import { IncidenteService } from './incidente';

describe('IncidenteService', () => {
  let servicio: IncidenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(IncidenteService);
  });

  describe('agrupadorAplicaA', () => {
    it('limita PeriodStart a Cotizador Autos', () => {
      expect(servicio.agrupadorAplicaA('PeriodStart', 'Cotizador Autos')).toBe(true);
      expect(servicio.agrupadorAplicaA('PeriodStart', 'Cotizador Salud')).toBe(false);
    });

    it('muestra todos los agrupadores sin aplicativo seleccionado', () => {
      expect(servicio.agrupadorAplicaA('PeriodStart', '')).toBe(true);
    });

    it('deja sin restricción los agrupadores que no están en el mapa', () => {
      expect(servicio.agrupadorAplicaA('Firma Electronica', 'Cotizador Salud')).toBe(true);
    });
  });
});
