import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoteTabelaComponent } from './lote-tabela';
import { Lote } from '../../../../core/models/lote';

describe('LoteTabelaComponent', () => {
  let component: LoteTabelaComponent;
  let fixture: ComponentFixture<LoteTabelaComponent>;

  // Massa de dados para simular o que vem do componente pai
  const mockLotes: Lote[] = [
    {
      idLote: 1,
      dataEntrada: new Date(),
      valor: 1000,
      quantLancamentos: 1,
      usuarioRegistro: 'tester_01',
      situacaoLote: 'Aberto',
      dataHoraSituacaoLote: new Date(),
      lancamentos: []
    },
    {
      idLote: 2,
      dataEntrada: new Date(),
      valor: 2000,
      quantLancamentos: 2,
      usuarioRegistro: 'tester_02',
      situacaoLote: 'Confirmado',
      dataHoraSituacaoLote: new Date(),
      lancamentos: []
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoteTabelaComponent,
        BrowserAnimationsModule // Essencial para os componentes de tabela do Material
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoteTabelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara inicialização
  });

  describe('Inicialização', () => {
    it('deve criar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve conectar o paginator ao dataSource após a inicialização da view', () => {
      // O ngAfterViewInit já rodou no detectChanges() do beforeEach
      expect(component.dataSource.paginator).toBeTruthy();
      expect(component.dataSource.paginator).toBe(component.paginator);
    });
  });

  describe('Interceptação de Dados (Input Setter)', () => {
    it('deve atualizar o dataSource, limpar seleção e emitir evento ao receber novos lotes', () => {
      spyOn(component.selecao, 'clear');
      spyOn(component.selecaoAlterada, 'emit');

      // Simulando o componente pai enviando novos dados
      component.lotes = mockLotes;

      expect(component.dataSource.data).toEqual(mockLotes);
      expect(component.selecao.clear).toHaveBeenCalled();
      expect(component.selecaoAlterada.emit).toHaveBeenCalledWith([]);
    });
  });

  describe('Ações de Seleção (Checkboxes)', () => {
    beforeEach(() => {
      // Alimenta a tabela antes de cada teste de seleção
      component.lotes = mockLotes;
    });

    it('deve retornar true em todosSelecionados() APENAS se todas as linhas estiverem marcadas', () => {
      expect(component.todosSelecionados()).toBeFalse();

      component.selecao.select(mockLotes[0]);
      expect(component.todosSelecionados()).toBeFalse();

      component.selecao.select(mockLotes[1]);
      expect(component.todosSelecionados()).toBeTrue();
    });

    it('deve emitir os dados da linha ao alternarLinha()', () => {
      spyOn(component.selecaoAlterada, 'emit');

      // Clica na primeira linha
      component.alternarLinha(mockLotes[0]);

      expect(component.selecao.isSelected(mockLotes[0])).toBeTrue();
      expect(component.selecaoAlterada.emit).toHaveBeenCalledWith([mockLotes[0]]);
    });

    it('deve selecionar todos ao acionar alternarTodos() se nenhum/alguns estiverem selecionados', () => {
      spyOn(component.selecaoAlterada, 'emit');

      component.alternarTodos(); // Clica no checkbox do cabeçalho

      expect(component.selecao.selected.length).toBe(2);
      expect(component.selecaoAlterada.emit).toHaveBeenCalledWith(mockLotes);
    });

    it('deve desselecionar todos ao acionar alternarTodos() se TODOS já estiverem selecionados', () => {
      spyOn(component.selecaoAlterada, 'emit');

      // Força a seleção de todos
      component.selecao.select(...mockLotes);

      // Clica no checkbox do cabeçalho novamente
      component.alternarTodos();

      expect(component.selecao.selected.length).toBe(0);
      expect(component.selecaoAlterada.emit).toHaveBeenCalledWith([]);
    });
  });
});