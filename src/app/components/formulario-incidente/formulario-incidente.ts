import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IncidenteService } from '../../services/incidente';
import { Storage } from '../../services/storage';
import { IncidenteCompartido } from '../../services/incidente-compartido';
import { Incidente } from '../../models/incidente';
import { BackendApiService, HURaizal } from '../../services/backend-api';

const MENSAJE_CIERRE = 'Ha sido un gusto ayudarte. En breve recibirás un correo con la resolución del incidente y una breve encuesta de satisfacción. Solo tomará 3 minutos y tus comentarios nos ayudan a mejorar. ¡Gracias por tu confianza!';

@Component({
  selector: 'app-formulario-incidente',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-incidente.html',
  styleUrl: './formulario-incidente.scss',
})
export class FormularioIncidente implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  formulario!: FormGroup;
  textoGenerado: string = '';
  toastMessage: string = '';
  mostrarToast: boolean = false;

  // Signals para HU Raizales
  raizalesDisponibles = signal<HURaizal[]>([]);
  busquedaRaizal = signal<string>('');
  raizalSeleccionada = signal<string>('');
  mostrarSugerenciasRaizal = signal<boolean>(false);
  mostrarCampoOtro = signal<boolean>(false);
  mostrarModalRaizales = signal<boolean>(false);

  // Computed para sugerencias filtradas
  sugerenciasRaizal = computed(() => {
    const busqueda = this.busquedaRaizal().toLowerCase().trim();
    if (!busqueda) return [];
    
    return this.raizalesDisponibles()
      .filter(r => 
        r.numero_historia.toLowerCase().includes(busqueda) ||
        r.descripcion.toLowerCase().includes(busqueda)
      )
      .slice(0, 15);
  });

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

  causasRaiz = ["Identificada", "Sin Identificar"];

  constructor(
    private fb: FormBuilder,
    public incidenteService: IncidenteService,
    private storageService: Storage,
    private incidenteCompartido: IncidenteCompartido,
    private backendApi: BackendApiService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarBorrador();
    this.configurarValidaciones();
    this.cargarIncidenteRecuperado();
    this.cargarRaizales();
    this.formulario.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(valores => this.incidenteCompartido.setBorrador(valores));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarBorrador(): void {
    const borrador = this.incidenteCompartido.getBorrador();
    if (borrador) {
      this.formulario.patchValue(borrador, { emitEvent: false });
    }
  }

  cargarIncidenteRecuperado(): void {
    const incidente = this.incidenteCompartido.getIncidente();
    if (incidente) {
      this.formulario.patchValue(incidente);
      this.incidenteCompartido.limpiarIncidente();
    }
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      causaError: ['', Validators.required],
      huRaizal: ['', Validators.required],
      huRaizalOtro: [''], // Campo para raizales custom
      causaRaiz: ['', Validators.required],
      descripcionSolucion: ['', Validators.required],
      confirmacionUsuario: ['Si', Validators.required]
    });
  }

  configurarValidaciones(): void {
    this.formulario.get('huRaizal')?.valueChanges.subscribe(valor => {
      if (valor && !this.incidenteService.validarHURaizal(valor)) {
        this.showToast('No se permite "N/A", "NA" o "No aplica" en HU Raizal / Mejora');
        this.formulario.patchValue({ huRaizal: '' }, { emitEvent: false });
      }
    });
  }

  generarTexto(): void {
    if (this.formulario.invalid) {
      this.showToast('Por favor completa todos los campos obligatorios');
      this.marcarCamposComoTocados();
      return;
    }

    const v = this.formulario.value;
    
    // Validar que si se seleccionó "Otro", el campo huRaizalOtro tenga contenido
    if (this.mostrarCampoOtro() && (!v.huRaizalOtro || v.huRaizalOtro.trim().length < 10)) {
      this.showToast('Por favor ingresa el motivo/causa del error (mínimo 10 caracteres)');
      this.formulario.get('huRaizalOtro')?.markAsTouched();
      return;
    }

    // Determinar valor de HU Raizal: si es "Otro" usar el texto libre, si no solo el número
    let raizalTexto: string;
    if (this.mostrarCampoOtro()) {
      raizalTexto = v.huRaizalOtro?.trim() || 'Sin especificar';
    } else {
      raizalTexto = this.incidenteService.extraerNumeroRaizal(v.huRaizal);
    }
    
    this.textoGenerado = `* Causa del Error: ${v.causaError}
* HU Raizal / Mejora: ${raizalTexto}
* Causa Raíz (Identificada/Sin Identificar): ${v.causaRaiz}
* Descripción de Solución: ${v.descripcionSolucion}

${MENSAJE_CIERRE}

* Confirmar Operatividad del Usuario Afectado: ${v.confirmacionUsuario}`.trim();
  }

  guardarIncidente(): void {
    if (this.formulario.invalid) {
      this.showToast('Completa el formulario antes de guardar');
      return;
    }

    const incidente: Incidente = { ...this.formulario.value };
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

  limpiarFormulario(): void {
    this.formulario.reset({
      confirmacionUsuario: 'Si'
    });
    this.textoGenerado = '';
    this.mostrarCampoOtro.set(false);
    this.busquedaRaizal.set('');
    this.mostrarSugerenciasRaizal.set(false);

    // Remover validaciones del campo huRaizalOtro
    this.formulario.get('huRaizalOtro')?.clearValidators();
    this.formulario.get('huRaizalOtro')?.updateValueAndValidity();

    this.incidenteCompartido.limpiarBorrador();
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key)?.markAsTouched();
    });
  }

  showToast(message: string): void {
    this.toastMessage = message;
    this.mostrarToast = true;
    
    // Si el mensaje es largo (más de 100 caracteres), dejarlo más tiempo
    const duration = message.length > 100 ? 6000 : 3500;
    
    setTimeout(() => {
      this.mostrarToast = false;
    }, duration);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.formulario.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // ===== MÉTODOS PARA HU RAIZALES =====

  cargarRaizales(): void {
    this.backendApi.obtenerTodasLasRaizales()
      .pipe(takeUntil(this.destroy$))
      .subscribe(raizales => {
        this.raizalesDisponibles.set(raizales);
      });
  }

  filtrarRaizales(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value;
    this.busquedaRaizal.set(valor);

    // Si escribe "OTRO" o variaciones, activar campo Otro automáticamente
    if (valor.trim().toLowerCase() === 'otro' || valor.trim().toLowerCase() === 'otra') {
      this.seleccionarOtro();
      return;
    }

    this.mostrarSugerenciasRaizal.set(valor.trim().length > 0);

    // Si no hay sugerencias y hay texto, ofrecer opción "Otro"
    if (valor.trim().length > 0 && this.sugerenciasRaizal().length === 0) {
      this.mostrarSugerenciasRaizal.set(true);
    }
  }

  seleccionarRaizal(raizal: HURaizal): void {
    const valorCompleto = `${raizal.numero_historia} - ${raizal.tipo} - ${raizal.descripcion}`;
    this.formulario.patchValue({ huRaizal: valorCompleto });
    this.raizalSeleccionada.set(raizal.numero_historia);
    this.busquedaRaizal.set(valorCompleto);
    this.mostrarSugerenciasRaizal.set(false);
    this.mostrarCampoOtro.set(false);
    
    // Remover validaciones del campo huRaizalOtro
    this.formulario.get('huRaizalOtro')?.clearValidators();
    this.formulario.get('huRaizalOtro')?.updateValueAndValidity();
    this.formulario.patchValue({ huRaizalOtro: '' });

    // Incrementar contador de uso
    this.backendApi.incrementarUsoRaizal(raizal.numero_historia).subscribe();
    
    this.showToast(`✅ Raizal ${raizal.numero_historia} seleccionada. ⚠️ IMPORTANTE: Debes asociar este incidente a la raizal ${raizal.numero_historia} en Azure.`);
  }

  seleccionarOtro(): void {
    this.mostrarCampoOtro.set(true);
    this.mostrarSugerenciasRaizal.set(false);
    this.formulario.patchValue({ huRaizal: 'OTRO' });

    // Hacer el campo huRaizalOtro obligatorio
    this.formulario.get('huRaizalOtro')?.setValidators([Validators.required, Validators.minLength(10)]);
    this.formulario.get('huRaizalOtro')?.updateValueAndValidity();

    this.showToast('💡 Ingresa el motivo/causa del error en el campo "Otro"');
  }



  ocultarSugerenciasRaizal(): void {
    setTimeout(() => this.mostrarSugerenciasRaizal.set(false), 200);
  }

  abrirModalRaizales(): void {
    this.mostrarModalRaizales.set(true);
  }

  cerrarModalRaizales(): void {
    this.mostrarModalRaizales.set(false);
  }
}

