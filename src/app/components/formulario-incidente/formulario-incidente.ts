import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IncidenteService } from '../../services/incidente';
import { Storage } from '../../services/storage';
import { IncidenteCompartido } from '../../services/incidente-compartido';
import { Incidente } from '../../models/incidente';
import { BackendApiService, HURaizal } from '../../services/backend-api';

const MENSAJE_CIERRE = 'Ha sido un gusto ayudarte. En breve recibirás un correo con la resolución del incidente y una breve encuesta de satisfacción. Solo tomará 3 minutos y tus comentarios nos ayudan a mejorar. ¡Gracias por tu confianza!';

const PREFIJO_FALLA        = 'Falla en el Microservicio o Proceso de ';
const PREFIJO_CAPACITACION = 'Capacitación de usuario o proceso';

@Component({
  selector: 'app-formulario-incidente',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './formulario-incidente.html',
  styleUrl: './formulario-incidente.scss',
})
export class FormularioIncidente implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  formulario!: FormGroup;
  textoGenerado: string = '';
  toastMessage: string = '';
  mostrarToast: boolean = false;

  // Signals HU Raizales
  raizalesDisponibles = signal<HURaizal[]>([]);
  busquedaRaizal      = signal<string>('');
  raizalSeleccionada  = signal<string>('');
  mostrarSugerenciasRaizal = signal<boolean>(false);
  mostrarCampoOtro    = signal<boolean>(false);
  mostrarModalRaizales = signal<boolean>(false);
  filtroModalRaizales  = signal<string>('');

  // Modales
  mostrarModalCapacitacion = signal<boolean>(false);
  mostrarModalAzureDevops  = signal<boolean>(false);
  raizalParaAzure          = signal<string>('');

  // Prefijo fijo OTRO
  prefijoCampoOtro  = signal<string>('');
  esCapacitacion    = signal<boolean>(false);
  // sufijo que escribe el usuario (solo para modo "falla")
  sufijoCampoOtro   = '';

  // Sugerencias raizales
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

  // Listado del modal "Ver": filtrado por búsqueda y ordenado por columna
  ordenModalRaizales = signal<{ col: 'numero' | 'tipo' | 'descripcion' | 'uso'; dir: 1 | -1 }>({ col: 'numero', dir: 1 });

  raizalesModal = computed(() => {
    const busqueda = this.filtroModalRaizales().toLowerCase().trim();
    const lista = busqueda
      ? this.raizalesDisponibles().filter(r =>
          r.numero_historia.toLowerCase().includes(busqueda) ||
          r.descripcion.toLowerCase().includes(busqueda)
        )
      : this.raizalesDisponibles();

    const { col, dir } = this.ordenModalRaizales();
    return [...lista].sort((a, b) => {
      switch (col) {
        case 'numero':      return dir * (Number(a.numero_historia) - Number(b.numero_historia));
        case 'tipo':        return dir * a.tipo.localeCompare(b.tipo);
        case 'descripcion': return dir * a.descripcion.localeCompare(b.descripcion);
        case 'uso':         return dir * ((a.usado_contador || 0) - (b.usado_contador || 0));
      }
    });
  });

  ordenarModalRaizalesPor(col: 'numero' | 'tipo' | 'descripcion' | 'uso'): void {
    this.ordenModalRaizales.update(actual =>
      actual.col === col ? { col, dir: actual.dir === 1 ? -1 : 1 } : { col, dir: 1 }
    );
  }

  causasError = [
    { value: "1. Capacitación - Tiene la opción pero no sabe cómo hacerlo",     label: "1. Capacitación - Tiene la opción pero no sabe cómo hacerlo" },
    { value: "2. Capacitación - Desconoce el proceso de Negocio",               label: "2. Capacitación - Desconoce el proceso de Negocio" },
    { value: "3. Capacitación - Desconoce el uso del aplicativo",               label: "3. Capacitación - Desconoce el uso del aplicativo" },
    { value: "4. Mejoras - Redefinición de Políticas y/o Procesos de negocio",  label: "4. Mejoras - Redefinición de Políticas" },
    { value: "5. Mejoras - Se requiere una nueva funcionalidad",                 label: "5. Mejoras - Nueva funcionalidad" },
    { value: "6. Errores de la aplicación",                                     label: "6. Errores de la aplicación" },
    { value: "7. Perfilacion / Accesos - El usuario no cuenta con los permisos",label: "7. Perfilación / Accesos" },
    { value: "8. Degradación de Servicios",                                     label: "8. Degradación de Servicios" },
    { value: "9. Datos errados",                                                label: "9. Datos errados" },
    { value: "10. Solucionado sin acciones - Fue un error Momentaneo",          label: "10. Error Momentáneo" },
    { value: "11. Modificacion Dato - Se modifica un Valor el cual era incorrecto", label: "11. Modificación Dato" },
    { value: "12. Modificacion De Codigo - Se Modifica Algo del codigo",        label: "12. Modificación De Código" },
    { value: "13. Usuario desincronizado",                                      label: "13. Usuario desincronizado" },
    { value: "14. No detectada (Usuario ya no tiene póliza para confirmar)",    label: "14. No detectada" },
    { value: "15. Error masivo en salud",                                       label: "15. Error masivo en salud" },
    { value: "16. Actualización APP",                                           label: "16. Actualización APP" },
    { value: "17. Intermitencia servicio externo",                              label: "17. Intermitencia servicio externo" },
    { value: "18. Error de autenticación SEUS - salud",                        label: "18. Error autenticación SEUS" },
    { value: "19. Error del dispositivo",                                       label: "19. Error del dispositivo" },
    { value: "20. Problema externo a la aplicación",                            label: "20. Problema externo" }
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
    if (borrador) this.formulario.patchValue(borrador, { emitEvent: false });
  }

  cargarIncidenteRecuperado(): void {
    const incidente = this.incidenteCompartido.getIncidente();
    if (incidente) {
      this.formulario.patchValue(incidente);
      if (incidente.huRaizalOtro) {
        this.mostrarCampoOtro.set(true);
        this.busquedaRaizal.set('OTRO');
        this.formulario.get('huRaizalOtro')?.setValidators([Validators.required, Validators.minLength(10)]);
        this.formulario.get('huRaizalOtro')?.updateValueAndValidity();

        // Restaurar prefijo y sufijo
        if (incidente.huRaizalOtro.startsWith(PREFIJO_FALLA)) {
          this.prefijoCampoOtro.set(PREFIJO_FALLA);
          this.esCapacitacion.set(false);
          this.sufijoCampoOtro = incidente.huRaizalOtro.slice(PREFIJO_FALLA.length);
        } else {
          this.prefijoCampoOtro.set(PREFIJO_CAPACITACION);
          this.esCapacitacion.set(true);
          this.sufijoCampoOtro = '';
        }
      } else if (incidente.huRaizal && incidente.huRaizal !== 'OTRO') {
        this.busquedaRaizal.set(incidente.huRaizal);
        this.raizalSeleccionada.set(this.incidenteService.extraerNumeroRaizal(incidente.huRaizal));
      }
      this.incidenteCompartido.limpiarIncidente();
    }
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      causaError:           ['', Validators.required],
      huRaizal:             ['', Validators.required],
      huRaizalOtro:         [''],
      causaRaiz:            ['', Validators.required],
      descripcionSolucion:  ['', Validators.required],
      confirmacionUsuario:  ['Si', Validators.required]
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

  // ===== SUFIJO: actualizar form control cuando usuario escribe =====
  onSufijoChange(): void {
    const valorCompleto = this.prefijoCampoOtro() + this.sufijoCampoOtro;
    this.formulario.patchValue({ huRaizalOtro: valorCompleto }, { emitEvent: false });
  }

  // ===== GENERAR TEXTO =========================================
  generarTexto(): void {
    if (this.formulario.invalid) {
      this.showToast('Por favor completa todos los campos obligatorios');
      this.marcarCamposComoTocados();
      return;
    }

    const v = this.formulario.value;

    if (this.mostrarCampoOtro()) {
      const valorOtro = v.huRaizalOtro || '';
      if (!valorOtro || valorOtro.trim().length < 10) {
        this.showToast('Por favor completa el campo "Motivo / Causa" (mínimo 10 caracteres)');
        return;
      }
    }

    const raizalTexto = this.mostrarCampoOtro()
      ? (v.huRaizalOtro?.trim() || 'Sin especificar')
      : this.incidenteService.extraerNumeroRaizal(v.huRaizal);

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
    if (!this.textoGenerado) { this.showToast('Primero genera el texto'); return; }
    navigator.clipboard.writeText(this.textoGenerado).then(() => {
      this.showToast('📋 Texto copiado al portapapeles');
    });
  }

  limpiarFormulario(): void {
    this.formulario.reset({ confirmacionUsuario: 'Si' });
    this.textoGenerado = '';
    this.mostrarCampoOtro.set(false);
    this.busquedaRaizal.set('');
    this.raizalSeleccionada.set('');
    this.mostrarSugerenciasRaizal.set(false);
    this.prefijoCampoOtro.set('');
    this.esCapacitacion.set(false);
    this.sufijoCampoOtro = '';
    this.formulario.get('huRaizalOtro')?.clearValidators();
    this.formulario.get('huRaizalOtro')?.updateValueAndValidity();
    this.incidenteCompartido.limpiarBorrador();
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.formulario.controls).forEach(k => this.formulario.get(k)?.markAsTouched());
  }

  showToast(message: string): void {
    this.toastMessage = message;
    this.mostrarToast = true;
    const duration = message.length > 100 ? 6000 : 3500;
    setTimeout(() => { this.mostrarToast = false; }, duration);
  }

  isFieldInvalid(fieldName: string): boolean {
    const f = this.formulario.get(fieldName);
    return !!(f && f.invalid && f.touched);
  }

  // ===== RAIZALES =============================================
  cargarRaizales(): void {
    this.backendApi.obtenerTodasLasRaizales()
      .pipe(takeUntil(this.destroy$))
      .subscribe(r => this.raizalesDisponibles.set(r));
  }

  filtrarRaizales(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.busquedaRaizal.set(valor);

    if (valor.trim().toLowerCase() === 'otro' || valor.trim().toLowerCase() === 'otra') {
      this.abrirModalCapacitacion();
      return;
    }
    this.mostrarSugerenciasRaizal.set(valor.trim().length > 0);
  }

  seleccionarRaizal(raizal: HURaizal): void {
    const valorCompleto = `${raizal.numero_historia} - ${raizal.tipo} - ${raizal.descripcion}`;
    this.formulario.patchValue({ huRaizal: valorCompleto });
    this.raizalSeleccionada.set(raizal.numero_historia);
    this.busquedaRaizal.set(valorCompleto);
    this.mostrarSugerenciasRaizal.set(false);
    this.mostrarCampoOtro.set(false);
    this.formulario.get('huRaizalOtro')?.clearValidators();
    this.formulario.get('huRaizalOtro')?.updateValueAndValidity();
    this.formulario.patchValue({ huRaizalOtro: '' });
    this.backendApi.incrementarUsoRaizal(raizal.numero_historia).subscribe();
    this.raizalParaAzure.set(raizal.numero_historia);
    this.mostrarModalAzureDevops.set(true);
  }

  ocultarSugerenciasRaizal(): void {
    setTimeout(() => {
      this.mostrarSugerenciasRaizal.set(false);
      const formValue = this.formulario.get('huRaizal')?.value;
      if (!formValue) return;
      const esOTRO = formValue === 'OTRO';
      const esValida = this.raizalesDisponibles().some(r =>
        formValue === `${r.numero_historia} - ${r.tipo} - ${r.descripcion}`
      );
      if (!esOTRO && !esValida) {
        this.formulario.patchValue({ huRaizal: '' }, { emitEvent: false });
        this.busquedaRaizal.set('');
        this.raizalSeleccionada.set('');
        this.showToast('⚠️ Debes seleccionar una raizal del listado o elegir "OTRO"');
      }
    }, 250);
  }

  // ===== MODAL CAPACITACIÓN ===================================
  abrirModalCapacitacion(): void {
    this.mostrarSugerenciasRaizal.set(false);
    this.formulario.patchValue({ huRaizal: 'OTRO' });
    this.mostrarModalCapacitacion.set(true);
  }

  confirmarCapacitacion(esCapacitacion: boolean): void {
    this.mostrarModalCapacitacion.set(false);
    this.mostrarCampoOtro.set(true);
    this.busquedaRaizal.set('OTRO');
    this.esCapacitacion.set(esCapacitacion);
    this.sufijoCampoOtro = '';

    if (esCapacitacion) {
      this.prefijoCampoOtro.set(PREFIJO_CAPACITACION);
      this.formulario.patchValue({ huRaizalOtro: PREFIJO_CAPACITACION });
      // Campo de capacitación es completo, sin sufijo requerido
      this.formulario.get('huRaizalOtro')?.setValidators([Validators.required]);
    } else {
      this.prefijoCampoOtro.set(PREFIJO_FALLA);
      this.formulario.patchValue({ huRaizalOtro: PREFIJO_FALLA });
      this.formulario.get('huRaizalOtro')?.setValidators([
        Validators.required,
        Validators.minLength(PREFIJO_FALLA.length + 3)
      ]);
    }
    this.formulario.get('huRaizalOtro')?.updateValueAndValidity();
  }

  seleccionarOtro(): void { this.abrirModalCapacitacion(); }

  // ===== MODAL AZURE DEVOPS ===================================
  cerrarModalAzureDevops(): void { this.mostrarModalAzureDevops.set(false); }

  // ===== MODAL RAIZALES ======================================
  abrirModalRaizales(): void {
    this.filtroModalRaizales.set('');
    this.ordenModalRaizales.set({ col: 'numero', dir: 1 });
    this.mostrarModalRaizales.set(true);
  }
  cerrarModalRaizales(): void { this.mostrarModalRaizales.set(false); }
  filtrarModalRaizales(event: Event): void {
    this.filtroModalRaizales.set((event.target as HTMLInputElement).value);
  }
}
