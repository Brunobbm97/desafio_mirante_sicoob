import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoteFiltrosComponent } from '../../components/lote-filtros/lote-filtros';
import { LoteTabelaComponent } from '../../components/lote-tabela/lote-tabela';
import { ModalLancamentoComponent } from '../../components/modal-lancamento/modal-lancamento';
import { LoteService } from '../../../../core/services/lote';
import { Lote } from '../../../../core/models/lote';
import { FiltrosPesquisaLote } from '../../../../core/models/contabil.model';

@Component({
  selector: 'app-consulta-lotes',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    LoteFiltrosComponent,
    LoteTabelaComponent
  ],
  templateUrl: './consulta-lotes.html',
  styleUrl: './consulta-lotes.scss'
})
export class ConsultaLotesComponent implements OnInit {
  lotes: Lote[] = [];
  lotesSelecionados: Lote[] = [];

  constructor(
    private loteService: LoteService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.pesquisar({});
  }

  pesquisar(filtros: FiltrosPesquisaLote): void {
    this.loteService.pesquisarLotes(filtros).subscribe({
      next: (dados) => {
        this.lotes = [...dados];
        this.lotesSelecionados = [];
      },
      error: (err) => console.error('Erro ao buscar lotes', err)
    });
  }

  atualizarSelecao(selecionados: Lote[]): void {
    this.lotesSelecionados = selecionados;
  }

  get apenasUmLoteSelecionado(): boolean {
    return this.lotesSelecionados.length === 1;
  }

  abrirModalIncluir(): void {
    const idLoteMock = this.apenasUmLoteSelecionado ? this.lotesSelecionados[0].idLote : 2;

    const dialogRef = this.dialog.open(ModalLancamentoComponent, {
      width: '650px',
      disableClose: true,
      data: { idLote: idLoteMock }
    });

    dialogRef.afterClosed().subscribe(resultado => {

      if (resultado) {

        this.loteService.incluirLancamento(idLoteMock, resultado).subscribe({
          next: (sucesso) => {
            if (sucesso) {
              this.pesquisar({});
            }
          }
        });
      }
    });
  }
}