export interface Incidente {
  id?: string;
  fecha?: Date;
  causaError: string;
  huRaizal: string;
  causaRaiz: string;
  descripcionSolucion: string;
  confirmacionUsuario: string;
  // Campos adicionales para análisis
  numeroIncidente?: string;
  analista?: string;
  urgencia?: 'Crítica' | 'Alta' | 'Media' | 'Baja';
  cumpleANS?: 'Sí' | 'No';
  fechaReapertura?: Date | null;
  estado?: 'Abierto' | 'Cerrado' | 'Reabierto';
}

