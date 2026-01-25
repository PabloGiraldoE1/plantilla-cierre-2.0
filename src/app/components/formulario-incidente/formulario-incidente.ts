import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IncidenteService } from '../../services/incidente';
import { Storage } from '../../services/storage';
import { AgrupadorSeleccionado } from '../../services/agrupador-seleccionado';
import { Incidente } from '../../models/incidente';

@Component({
  selector: 'app-formulario-incidente',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-incidente.html',
  styleUrl: './formulario-incidente.scss',
})
export class FormularioIncidente implements OnInit {
  formulario!: FormGroup;
  textoGenerado: string = '';
  externalTicket: string = '';
  mostrarExternalTicket: boolean = false;
  sugerenciasAgrupador: string[] = [];
  mostrarSugerencias: boolean = false;
  toastMessage: string = '';
  mostrarToast: boolean = false;

  causasError = [
    { value: "1. Capacitación - Tiene la opción pero no sabe cómo hacerlo", label: "1. Capacitación - Tiene la opción pero no sabe cómo hacerlo" },
    { value: "2. Capacitación - Desconoce el proceso de Negocio", label: "2. Capacitación - Desconoce el proceso de Negocio" },
    { value: "3. Capacitación - Desconoce el uso del aplicativo", label: "3. Capacitación - Desconoce el uso del aplicativo" },
    { value: "4. Mejoras - Redefinición de Políticas y/o Procesos de negocio", label: "4. Mejoras - Redefinición de Políticas" },
    { value: "5. Mejoras - Se requiere una nueva funcionalidad", label: "5. Mejoras - Nueva funcionalidad" },
    { value: "6. Errores de la aplicación", label: "6. Errores de la aplicación" },
    { value: "7. Perfilacion / Accesos - El usuario no cuenta con los permisos", label: "7. Perfilación / Accesos" },
    { value: "8. Degradación de Servicios", label: "8. Degradación de Servicios" },
    { value: "9. Datos errados", label: "9. Datos errados" },
    { value: "10. Solucionado sin acciones - Fue un error Momentaneo", label: "10. Error Momentáneo" },
    { value: "11. Modificacion Dato - Se modifica un Valor el cual era incorrecto", label: "11. Modificación Dato" },
    { value: "12. Modificacion De Codigo - Se Modifica Algo del codigo", label: "12. Modificación De Código" },
    { value: "13. Usuario desincronizado", label: "13. Usuario desincronizado" },
    { value: "14. No detectada (Usuario ya no tiene póliza para confirmar)", label: "14. No detectada" },
    { value: "15. Error masivo en salud", label: "15. Error masivo en salud" },
    { value: "16. Actualización APP", label: "16. Actualización APP" },
    { value: "17. Intermitencia servicio externo", label: "17. Intermitencia servicio externo" },
    { value: "18. Error de autenticación SEUS - salud", label: "18. Error autenticación SEUS" },
    { value: "19. Error del dispositivo", label: "19. Error del dispositivo" },
    { value: "20. Problema externo a la aplicación", label: "20. Problema externo" }
  ];

  procesosError = [
    "1. Expedicion", "3. Reclamacion", "4. Cotizacion", "5. Modificacion",
    "6. Reaseguro", "7. Impresión", "9. Asesoria y Venta", "11. Cancelaciones",
    "12. Configuracion de Producto", "13. Emision de Recibos", "14. Recaudo",
    "15. Cambios de Comisiones", "16. Cambios de Deducible", "17. Estrategias Comerciales",
    "18. Anulacion de Recibos", "19. Cobros", "20. Recibo manual",
    "21. Sacar de bolsa", "22. Pago siniestros", "23. P8 (Documentos)",
    "24. ATR", "25. Case Tracking", "26. Gestion de la informacion de cliente",
    "27. Consultar información", "28. Reserva sinietros", "34. Login",
    "35. Solicitud hogar", "36. Sincronización", "37. Creación de cita",
    "38. Conductor Elegido", "39. Cierre de sesión", "40. Inspeccion virtual",
    "41. Reembolso", "42. Bolsillo", "43. Firma remota", "44. Sarlaft",
    "45. Fatca", "47. Información de Cliente", "48. Información de riesgo/negocio",
    "49. Tarifación", "50. Solicitud electrónica", "51. Plan de Recompensa",
    "52. Reporte Monitoreo", "53. Error de Tipificación", "54. AWS",
    "55. Reportes Producción", "56. Agregar Soat Digital", "57. Pagar Cita Virtual",
    "58. Firma Contrato ViaFirma", "59. Modulo de Pagos SEL", "60. Autorizacion",
    "61. Consulta", "62. Descargar documento", "63. Solicitud Evaluacion Medica",
    "64. Estado radicado - AUS", "65. Solicitud Autos", "66. Incidente duplicado"
  ];

  estadosRaizal = [
    "1. Identificada", "2. En curso", "3. Por Identificar",
    "4. Aislado", "5. Finalizada", "6. N/A"
  ];

  responsables = ["1. TI", "2. Negocio", "3. TI/Negocio"];
  causasRaiz = ["Identificada", "Sin Identificar"];

  constructor(
    private fb: FormBuilder,
    public incidenteService: IncidenteService,
    private storageService: Storage,
    private agrupadorService: AgrupadorSeleccionado
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.configurarValidaciones();
    this.cargarAgrupadorSeleccionado();
  }

  cargarAgrupadorSeleccionado(): void {
    const agrupador = this.agrupadorService.getAgrupador();
    if (agrupador) {
      this.formulario.patchValue({ agrupadorError: agrupador });
      this.actualizarExternalTicket();
      this.showToast('✅ Agrupador seleccionado: ' + agrupador);
    }
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      aplicativoAfectado: ['', Validators.required],
      procesoAplicativo: [''],
      agrupadorError: ['', Validators.required],
      causaError: [''],
      procesoError: [''],
      huRaizal: [''],
      estadoRaizal: [''],
      responsableSolucion: [''],
      diagnostico: ['', Validators.required],
      accionEjecutada: ['', Validators.required],
      descripcionSolucion: ['', Validators.required],
      confirmacionUsuario: ['Sí'],
      formularioCredenciales: [''],
      ocPam: [''],
      causaRaiz: ['']
    });
  }

  configurarValidaciones(): void {
    this.formulario.get('aplicativoAfectado')?.valueChanges.subscribe(() => {
      this.actualizarExternalTicket();
    });
    this.formulario.get('procesoAplicativo')?.valueChanges.subscribe(() => {
      this.actualizarExternalTicket();
    });
    this.formulario.get('agrupadorError')?.valueChanges.subscribe(() => {
      this.actualizarExternalTicket();
      this.onAgrupadorChange();
    });
    this.formulario.get('huRaizal')?.valueChanges.subscribe(valor => {
      if (valor && !this.incidenteService.validarHURaizal(valor)) {
        this.showToast('No se permite "N/A", "NA" o "No aplica" en HU Raizal');
        this.formulario.patchValue({ huRaizal: '' }, { emitEvent: false });
      }
    });
  }

  onAgrupadorChange(): void {
    const valor = this.formulario.get('agrupadorError')?.value || '';
    this.sugerenciasAgrupador = this.incidenteService.filtrarAgrupadores(valor);
    this.mostrarSugerencias = this.sugerenciasAgrupador.length > 0;
  }

  seleccionarSugerencia(sugerencia: string): void {
    this.formulario.patchValue({ agrupadorError: sugerencia });
    this.mostrarSugerencias = false;
    this.actualizarExternalTicket();
  }

  actualizarExternalTicket(): void {
    const aplicativo = this.formulario.get('aplicativoAfectado')?.value || '';
    const proceso = this.formulario.get('procesoAplicativo')?.value || '';
    const agrupador = this.formulario.get('agrupadorError')?.value || '';
    
    // Solo mostrar external ticket si los 3 campos tienen valor
    this.mostrarExternalTicket = !!(aplicativo && proceso && agrupador);
    
    if (this.mostrarExternalTicket) {
      this.externalTicket = this.incidenteService.generarExternalTicket(aplicativo, proceso, agrupador);
    } else {
      this.externalTicket = '';
    }
  }

  generarTexto(): void {
    if (this.formulario.invalid) {
      this.showToast('Por favor completa todos los campos obligatorios');
      this.marcarCamposComoTocados();
      return;
    }

    const valores = this.formulario.value;
    this.textoGenerado = `
* Agrupador del Error: ${valores.agrupadorError}
* Causa del Error: ${valores.causaError}
* Proceso del Error: ${valores.procesoError}
* HU Raizal / Mejora: ${valores.huRaizal}
* Estado Raizal: ${valores.estadoRaizal}
* Responsable Solución: ${valores.responsableSolucion}
* Diagnóstico: ${valores.diagnostico}
* Acción Ejecutada: ${valores.accionEjecutada}
* Descripción de Solución: ${valores.descripcionSolucion}

Ha sido un gusto ayudarte. En breve recibirás un correo con la resolución del incidente y una breve encuesta de satisfacción. Solo tomará 3 minutos y tus comentarios nos ayudan a mejorar. ¡Gracias por tu confianza!

* Confirmar operatividad del usuario Afectado: ${valores.confirmacionUsuario}
* ID Formulario de Solicitud de Credenciales: ${valores.formularioCredenciales}
* OC Acceso a PAM - (PAM): ${valores.ocPam}
* Causa Raíz (Identificada/Sin Identificar): ${valores.causaRaiz}
    `.trim();
  }

  guardarIncidente(): void {
    if (this.formulario.invalid) {
      this.showToast('Completa el formulario antes de guardar');
      return;
    }

    const mensajeCierre = 'Ha sido un gusto ayudarte. En breve recibirás un correo con la resolución del incidente y una breve encuesta de satisfacción. Solo tomará 3 minutos y tus comentarios nos ayudan a mejorar. ¡Gracias por tu confianza!';

    const incidente: Incidente = {
      ...this.formulario.value,
      externalTicket: this.externalTicket,
      mensajeCierre
    };

    this.storageService.guardarIncidente(incidente);
    this.showToast('✅ Incidente guardado exitosamente');
    this.limpiarFormulario();
  }

  copiarAlPortapapeles(): void {
    if (!this.textoGenerado) {
      this.showToast('Primero genera el texto');
      return;
    }
    navigator.clipboard.writeText(this.textoGenerado).then(() => {
      this.showToast('📋 Texto copiado al portapapeles');
    });
  }

  copiarTicket(): void {
    if (!this.externalTicket) {
      this.showToast('No hay ticket para copiar');
      return;
    }
    navigator.clipboard.writeText(this.externalTicket).then(() => {
      this.showToast('📋 Ticket copiado');
    });
  }

  limpiarFormulario(): void {
    this.formulario.reset({
      confirmacionUsuario: 'Sí'
    });
    this.textoGenerado = '';
    this.externalTicket = '';
    this.sugerenciasAgrupador = [];
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key)?.markAsTouched();
    });
  }

  showToast(message: string): void {
    this.toastMessage = message;
    this.mostrarToast = true;
    setTimeout(() => {
      this.mostrarToast = false;
    }, 3500);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.formulario.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}

