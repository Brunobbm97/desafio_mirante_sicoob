import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Lancamento } from '../../../../core/models/lancamento';

export function contaCorrenteValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const isNumeric = /^\d+$/.test(value);
  const isValidLength = value.length >= 5;
  return (!isNumeric || !isValidLength) ? { contaInvalida: true } : null;
}

@Component({
  selector: 'app-modal-lancamento',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatCheckboxModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './modal-lancamento.html',
  styleUrl: './modal-lancamento.scss'
})
export class ModalLancamentoComponent implements OnInit {
  formLancamento!: FormGroup;
  nomeTitularEncontrado: string = '';

  historicos = ['Lançamento Manual', 'Ajuste de Saldo', 'Estorno de Tarifa'];
  pas = ['00 - PA Central', '01 - PA Filial Norte', '02 - PA Filial Sul'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalLancamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idLote: number }
  ) { }

  ngOnInit(): void {
    this.iniciarFormulario();
  }

  iniciarFormulario(): void {
    this.formLancamento = this.fb.group({
      contaCorrente: ['', [Validators.required, contaCorrenteValidator]],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      historico: ['', Validators.required],
      estorno: [false],
      documento: ['', Validators.required],
      descricao: [''],
      situacao: [{ value: 'Pendente', disabled: true }],
      pa: ['', Validators.required]
    });
  }

  buscarConta(): void {
    const conta = this.formLancamento.get('contaCorrente')?.value;
    if (this.formLancamento.get('contaCorrente')?.valid) {
      this.nomeTitularEncontrado = conta === '44444' ? 'Ana Paula Costa' : 'Cliente Não Identificado';
    } else {
      this.formLancamento.get('contaCorrente')?.markAsTouched();
    }
  }

  salvar(): void {
    if (this.formLancamento.valid) {
      const lancamentoGerado: Lancamento = this.formLancamento.getRawValue();
      lancamentoGerado.nomeTitular = this.nomeTitularEncontrado;

      this.dialogRef.close(lancamentoGerado);
    } else {
      this.formLancamento.markAllAsTouched();
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}