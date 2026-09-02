import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoteService } from './lote';
import { Lancamento } from '../models/lancamento';
import { FiltrosPesquisaLote } from '../models/contabil.model';
// Importamos o MOCK para garantir que os testes conhecem a base inicial
import { LOTES_MOCK } from './lote-mock';

describe('LoteService', () => {
  let service: LoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoteService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('Método: pesquisarLotes', () => {

    it('deve retornar todos os lotes (cópia do mock) se nenhum filtro for passado', fakeAsync(() => {
      let lotesRetornados: any;

      service.pesquisarLotes({} as FiltrosPesquisaLote).subscribe(res => {
        lotesRetornados = res;
      });

      // Avança o relógio interno do Angular em 800ms para resolver o delay() do RxJS
      tick(800);

      expect(lotesRetornados).toBeDefined();
      expect(lotesRetornados.length).toBe(LOTES_MOCK.length);
    }));

    it('deve filtrar lotes pela Situação', fakeAsync(() => {
      let lotesRetornados: any[] = [];

      service.pesquisarLotes({ situacaoLote: 'Aberto' }).subscribe(res => {
        lotesRetornados = res;
      });

      tick(800);

      expect(lotesRetornados.length).toBeGreaterThan(0);
      // Garante que absolutamente todos os itens retornados têm a situação 'Aberto'
      const todosAbertos = lotesRetornados.every(l => l.situacaoLote === 'Aberto');
      expect(todosAbertos).toBeTrue();
    }));

    it('deve filtrar lotes pela faixa de Valor (De/Até)', fakeAsync(() => {
      let lotesRetornados: any[] = [];

      service.pesquisarLotes({ valorLoteDe: 500, valorLoteAte: 1500 }).subscribe(res => {
        lotesRetornados = res;
      });

      tick(800);

      const valoresCorretos = lotesRetornados.every(l => l.valor >= 500 && l.valor <= 1500);
      expect(valoresCorretos).toBeTrue();
    }));
  });

  describe('Método: incluirLancamento', () => {
    const mockLancamento: Lancamento = {
      contaCorrente: '44444',
      valor: 150,
      historico: 'Lançamento Manual',
      estorno: false,
      documento: 'DOC-123',
      situacao: 'Pendente',
      pa: '00 - PA Central'
    };

    it('deve retornar false se tentar incluir lançamento em um ID de lote inexistente', fakeAsync(() => {
      let sucesso: boolean | undefined;

      service.incluirLancamento(999, mockLancamento).subscribe(res => {
        sucesso = res;
      });

      tick(500); // Resolve o delay(500) do método de inclusão

      expect(sucesso).toBeFalse();
    }));

    it('deve incluir o lançamento, incrementar a quantidade e retornar true se o lote for válido', fakeAsync(() => {
      let sucesso: boolean | undefined;

      // Assume-se que o lote ID 2 existe no LOTES_MOCK
      service.incluirLancamento(2, mockLancamento).subscribe(res => {
        sucesso = res;
      });

      tick(500);
      expect(sucesso).toBeTrue();

      // Agora fazemos uma pesquisa para conferir se o estado interno do serviço realmente mudou
      let loteAtualizado: any;
      service.pesquisarLotes({ idLoteDe: 2, idLoteAte: 2 }).subscribe(res => {
        loteAtualizado = res[0]; // Pega o lote alvo
      });

      tick(800); // Resolve o delay da pesquisa

      expect(loteAtualizado).toBeDefined();
      expect(loteAtualizado.lancamentos.length).toBeGreaterThan(0);
      expect(loteAtualizado.lancamentos[0].contaCorrente).toBe('44444');
      // Garante que a nossa correção de incremento matemático funcionou
      expect(loteAtualizado.quantLancamentos).toBeGreaterThan(1);
    }));
  });
});