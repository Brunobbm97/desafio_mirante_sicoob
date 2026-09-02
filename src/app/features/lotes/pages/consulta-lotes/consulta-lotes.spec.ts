import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { ConsultaLotesComponent } from './consulta-lotes';
import { LoteService } from '../../../../core/services/lote';
import { Lote } from '../../../../core/models/lote';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ConsultaLotesComponent', () => {
  let component: ConsultaLotesComponent;
  let fixture: ComponentFixture<ConsultaLotesComponent>;

  // Declaração dos Spies (Mocks) na raiz do describe
  let loteServiceSpy: jasmine.SpyObj<LoteService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  // Massa de dados fictícia para os testes
  const mockLote: Lote = {
    idLote: 5,
    dataEntrada: new Date(),
    valor: 1000,
    quantLancamentos: 1,
    usuarioRegistro: 'usuario_teste',
    situacaoLote: 'Aberto',
    dataHoraSituacaoLote: new Date(),
    lancamentos: []
  };

  beforeEach(async () => {
    // 1. Criamos os espiões
    const lServiceSpy = jasmine.createSpyObj('LoteService', ['pesquisarLotes', 'incluirLancamento']);
    const mDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ConsultaLotesComponent,
        BrowserAnimationsModule
      ]
    })
      // 2. Forçamos o componente Standalone a usar os nossos espiões
      .overrideProvider(MatDialog, { useValue: mDialogSpy })
      .overrideProvider(LoteService, { useValue: lServiceSpy })
      .compileComponents();

    // 3. Atribuímos as instâncias injetadas às variáveis globais do teste
    loteServiceSpy = TestBed.inject(LoteService) as jasmine.SpyObj<LoteService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    // Configuração padrão: o serviço sempre retorna um array vazio ao iniciar
    loteServiceSpy.pesquisarLotes.and.returnValue(of([]));

    fixture = TestBed.createComponent(ConsultaLotesComponent);
    component = fixture.componentInstance;
  });

  describe('Inicialização e Estado', () => {
    it('deve criar o componente e realizar a busca inicial no ngOnInit', () => {
      fixture.detectChanges(); // Dispara o ngOnInit

      expect(component).toBeTruthy();
      expect(loteServiceSpy.pesquisarLotes).toHaveBeenCalledWith({});
      expect(component.lotes).toEqual([]);
    });

    it('deve atualizar os lotesSelecionados ao acionar atualizarSelecao', () => {
      component.atualizarSelecao([mockLote]);
      expect(component.lotesSelecionados.length).toBe(1);
      expect(component.lotesSelecionados[0].idLote).toBe(5);
    });

    it('deve retornar true no getter apenasUmLoteSelecionado APENAS se houver 1 lote selecionado', () => {
      component.lotesSelecionados = [];
      expect(component.apenasUmLoteSelecionado).toBeFalse();

      component.lotesSelecionados = [mockLote];
      expect(component.apenasUmLoteSelecionado).toBeTrue();

      component.lotesSelecionados = [mockLote, mockLote];
      expect(component.apenasUmLoteSelecionado).toBeFalse();
    });
  });

  describe('Método: pesquisar', () => {
    it('deve preencher a variável lotes e limpar a seleção em caso de sucesso', () => {
      loteServiceSpy.pesquisarLotes.and.returnValue(of([mockLote]));
      component.lotesSelecionados = [mockLote];

      component.pesquisar({ situacaoLote: 'Aberto' });

      expect(loteServiceSpy.pesquisarLotes).toHaveBeenCalledWith({ situacaoLote: 'Aberto' });
      expect(component.lotes.length).toBe(1);
      expect(component.lotesSelecionados.length).toBe(0);
    });

    it('deve capturar erro no console caso o serviço falhe', () => {
      spyOn(console, 'error');
      loteServiceSpy.pesquisarLotes.and.returnValue(throwError(() => new Error('Erro na API')));

      component.pesquisar({});

      expect(console.error).toHaveBeenCalledWith('Erro ao buscar lotes', jasmine.any(Error));
    });
  });

  describe('Método: abrirModalIncluir', () => {
    let dialogRefSpyObj: any;

    beforeEach(() => {
      dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(null) });
      dialogSpy.open.and.returnValue(dialogRefSpyObj);
    });

    it('deve usar ID 2 como fallback se nenhum lote estiver selecionado', () => {
      component.lotesSelecionados = [];
      component.abrirModalIncluir();

      expect(dialogSpy.open).toHaveBeenCalled();
      const configPassada = dialogSpy.open.calls.mostRecent().args[1];
      expect((configPassada?.data as any).idLote).toBe(2);
    });

    it('deve usar o ID do lote selecionado se houver exatamente 1 selecionado', () => {
      component.lotesSelecionados = [mockLote];
      component.abrirModalIncluir();

      const configPassada = dialogSpy.open.calls.mostRecent().args[1];
      expect((configPassada?.data as any).idLote).toBe(5);
    });

    it('NÃO deve chamar incluirLancamento se o modal for fechado sem salvar (resultado undefined/null)', () => {
      dialogRefSpyObj.afterClosed.and.returnValue(of(null));

      component.abrirModalIncluir();

      expect(loteServiceSpy.incluirLancamento).not.toHaveBeenCalled();
    });

    it('deve chamar incluirLancamento e refazer a pesquisa se o modal for fechado com dados (salvar)', () => {
      const dadosDoModal = { valor: 100, contaCorrente: '12345' } as any;

      dialogRefSpyObj.afterClosed.and.returnValue(of(dadosDoModal));
      loteServiceSpy.incluirLancamento.and.returnValue(of(true));
      loteServiceSpy.pesquisarLotes.calls.reset();

      component.abrirModalIncluir();

      expect(loteServiceSpy.incluirLancamento).toHaveBeenCalledWith(2, dadosDoModal);
      expect(loteServiceSpy.pesquisarLotes).toHaveBeenCalled();
    });
  });
});