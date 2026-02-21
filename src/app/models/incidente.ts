export interface Incidente {
  id?: string;
  fecha?: Date;
  causaError: string;
  huRaizal: string;
  causaRaiz: string;
  descripcionSolucion: string;
  confirmacionUsuario: string;
}
