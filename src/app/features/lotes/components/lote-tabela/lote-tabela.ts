import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { Lote } from '../../../../core/models/lote';

@Component({
  selector: 'app-lote-tabela',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatCheckboxModule],
  templateUrl: './lote-tabela.html',
  styleUrl: './lote-tabela.scss'
})
export class LoteTabelaComponent implements AfterViewInit {

  // Intercepta a chegada de novos lotes e atualiza a grid e a seleção simultaneamente
  @Input() set lotes(dados: Lote[]) {
    this.dataSource.data = dados;
    this.selecao.clear(); // Limpa os checkboxes visualmente
    this.selecaoAlterada.emit([]); // Avisa o pai que ninguém está selecionado
  }

  @Output() selecaoAlterada = new EventEmitter<Lote[]>();

  colunas: string[] = [
    'select', 'idLote', 'dataEntrada', 'valor', 'quantLancamentos',
    'usuarioRegistro', 'usuarioAprovacao', 'situacaoLote', 'dataHoraSituacaoLote'
  ];

  dataSource = new MatTableDataSource<Lote>([]);
  selecao = new SelectionModel<Lote>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  todosSelecionados() {
    const numSelecionados = this.selecao.selected.length;
    const numLinhas = this.dataSource.data.length;
    return numSelecionados === numLinhas;
  }

  alternarTodos() {
    if (this.todosSelecionados()) {
      this.selecao.clear();
    } else {
      this.dataSource.data.forEach(row => this.selecao.select(row));
    }
    this.emitirSelecao();
  }

  alternarLinha(row: Lote) {
    this.selecao.toggle(row);
    this.emitirSelecao();
  }

  private emitirSelecao() {
    this.selecaoAlterada.emit(this.selecao.selected);
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['lotes'] && this.lotes) {
      this.dataSource.data = this.lotes;
    }
  }
}