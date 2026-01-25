export interface PlantillaTecnica {
  id?: string;
  fecha?: Date;
  aplicacionAfectada: string;
  po: string;
  contextoTecnico: string;
  codigoIncidentes: string;
  incidentesPorMes: string;
  impactoNegocio: string;
  solucionPuntual: string;
  afectaCanalAsesor: string;
  requiereBarrido: string;
  descripcionError: string;
}
