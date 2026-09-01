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
    return of(this.lotes).pipe(delay(800));
  }


  incluirLancamento(idLote: number, lancamento: Lancamento): Observable<boolean> {
    const lote = this.lotes.find(l => l.idLote === idLote);
    if (lote) {
      if (!lote.lancamentos) lote.lancamentos = [];

      lote.lancamentos.push({ ...lancamento, id: Date.now() });
      lote.quantLancamentos = lote.lancamentos.length;

      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }
}