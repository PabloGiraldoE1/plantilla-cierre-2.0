import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-plantilla-tecnica',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './plantilla-tecnica.html',
  styleUrl: './plantilla-tecnica.scss',
})
export class PlantillaTecnicaComponent implements OnInit {
  formulario!: FormGroup;
  textoGenerado: string = '';
  toastMessage: string = '';
  mostrarToast: boolean = false;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      aplicacionAfectada: ['', Validators.required],
      po: ['', Validators.required],
      contextoTecnico: ['', Validators.required],
      codigoIncidentes: ['', Validators.required],
      incidentesPorMes: ['', Validators.required],
      impactoNegocio: ['', Validators.required],
      solucionPuntual: ['', Validators.required],
      afectaCanalAsesor: ['SI', Validators.required],
      requiereBarrido: ['NO', Validators.required],
      descripcionError: ['', Validators.required]
    });
  }

  generarTexto(): void {
    if (this.formulario.invalid) {
      this.showToast('Por favor completa todos los campos obligatorios');
      this.marcarCamposComoTocados();
      return;
    }

    const valores = this.formulario.value;
    this.textoGenerado = `
* Aplicación Afectada: ${valores.aplicacionAfectada}
* PO: ${valores.po}
* Contexto Técnico: ${valores.contextoTecnico}
* Código de Incidentes: ${valores.codigoIncidentes}
* Incidentes por Mes: ${valores.incidentesPorMes}
* Impacto Negocio: ${valores.impactoNegocio}
* Solución Puntual (Confluence): ${valores.solucionPuntual}
* Afecta Canal Asesor: ${valores.afectaCanalAsesor}
* Requiere Barrido: ${valores.requiereBarrido}
* Descripción del Error: ${valores.descripcionError}
    `.trim();
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
      afectaCanalAsesor: 'SI',
      requiereBarrido: 'NO'
    });
    this.textoGenerado = '';
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
