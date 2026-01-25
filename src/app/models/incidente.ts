export interface Incidente {
  id?: string;
  fecha?: Date;
  aplicativoAfectado: string;
  procesoAplicativo: string;
  agrupadorError: string;
  causaError: string;
  procesoError: string;
  huRaizal: string;
  estadoRaizal: string;
  responsableSolucion: string;
  diagnostico: string;
  accionEjecutada: string;
  descripcionSolucion: string;
  confirmacionUsuario: string;
  formularioCredenciales: string;
  ocPam: string;
  causaRaiz: string;
  externalTicket?: string;
  mensajeCierre?: string;
}

export interface EstadisticasIncidente {
  totalIncidentes: number;
  porAplicativo: { [key: string]: number };
  porCausa: { [key: string]: number };
  porEstado: { [key: string]: number;
}
}
