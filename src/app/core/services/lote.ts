import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Lote } from '../models/lote';
import { Lancamento } from '../models/lancamento';
import { FiltrosPesquisaLote } from '../models/contabil.model';
import { LOTES_MOCK } from './lote-mock';

@Injectable({
  providedIn: 'root'
})
export class LoteService {

  private lotes: Lote[] = [...LOTES_MOCK];

  constructor() { }

  pesquisarLotes(filtros: FiltrosPesquisaLote): Observable<Lote[]> {
    let lotesFiltrados = [...this.lotes];

    if (!filtros) {
      return of(lotesFiltrados).pipe(delay(800));
    }

    if (filtros.situacaoLote && filtros.situacaoLote !== 'Todas') {
      lotesFiltrados = lotesFiltrados.filter(l => l.situacaoLote === filtros.situacaoLote);
    }

    if (filtros.idLoteDe) {
      lotesFiltrados = lotesFiltrados.filter(l => l.idLote >= filtros.idLoteDe!);
    }
    if (filtros.idLoteAte) {
      lotesFiltrados = lotesFiltrados.filter(l => l.idLote <= filtros.idLoteAte!);
    }

    if (filtros.valorLoteDe) {
      lotesFiltrados = lotesFiltrados.filter(l => l.valor >= filtros.valorLoteDe!);
    }
    if (filtros.valorLoteAte) {
      lotesFiltrados = lotesFiltrados.filter(l => l.valor <= filtros.valorLoteAte!);
    }

    if (filtros.dataEntradaDe) {
      const dataDe = new Date(filtros.dataEntradaDe).setHours(0, 0, 0, 0);
      lotesFiltrados = lotesFiltrados.filter(l => new Date(l.dataEntrada).setHours(0, 0, 0, 0) >= dataDe);
    }
    if (filtros.dataEntradaAte) {
      const dataAte = new Date(filtros.dataEntradaAte).setHours(23, 59, 59, 999);
      lotesFiltrados = lotesFiltrados.filter(l => new Date(l.dataEntrada).getTime() <= dataAte);
    }

    return of(lotesFiltrados).pipe(delay(800));
  }

  incluirLancamento(idLote: number, lancamento: Lancamento): Observable<boolean> {
    const index = this.lotes.findIndex(l => l.idLote === idLote);

    if (index !== -1) {
      const loteAtualizado = { ...this.lotes[index] };
      const lancamentos = loteAtualizado.lancamentos ? [...loteAtualizado.lancamentos] : [];

      lancamentos.push({ ...lancamento, id: Date.now() });

      loteAtualizado.lancamentos = lancamentos;

      loteAtualizado.quantLancamentos = loteAtualizado.quantLancamentos + 1;

      this.lotes[index] = loteAtualizado;
      this.lotes = [...this.lotes];

      return of(true).pipe(delay(500));
    }

    return of(false).pipe(delay(500));
  }
}