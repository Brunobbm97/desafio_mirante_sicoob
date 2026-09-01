import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FiltrosPesquisaLote } from '../../../../core/models/contabil.model';

@Component({
  selector: 'app-lote-filtros',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './lote-filtros.html',
  styleUrl: './lote-filtros.scss'
})
export class LoteFiltrosComponent {
  // Emite os valores do formulário para o componente pai (container)
  @Output() aoPesquisar = new EventEmitter<FiltrosPesquisaLote>();

  formFiltros: FormGroup;
  // Opções para o select de Situação Lote
  situacoes = ['Todas', 'Aberto', 'Enviado', 'Confirmado'];

  constructor(private fb: FormBuilder) {
    this.formFiltros = this.fb.group({
      instituicaoResp: [''],
      instituicao: [''],
      situacaoLote: ['Todas'],
      idLoteDe: [null],
      idLoteAte: [null],
      valorLoteDe: [null],
      valorLoteAte: [null],
      dataEntradaDe: [null],
      dataEntradaAte: [null]
    });
  }

  emitirPesquisa(): void {
    if (this.formFiltros.valid) {
      this.aoPesquisar.emit(this.formFiltros.value);
    }
  }
}