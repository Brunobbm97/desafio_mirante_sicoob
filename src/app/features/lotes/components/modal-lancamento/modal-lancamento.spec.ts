import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalLancamentoComponent, contaCorrenteValidator } from './modal-lancamento';

describe('ModalLancamentoComponent', () => {
  let component: ModalLancamentoComponent;
  let fixture: ComponentFixture<ModalLancamentoComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ModalLancamentoComponent>>;

  const mockDialogData = { idLote: 2 };

  beforeEach(async () => {
    // Cria um 'espião' para simular e monitorar os métodos do modal
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ModalLancamentoComponent, // Componente standalone
        ReactiveFormsModule,
        BrowserAnimationsModule // Necessário para os componentes do Material não quebrarem nos testes
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalLancamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara o ngOnInit()
  });

  describe('Inicialização', () => {
    it('deve criar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve inicializar o formulário com o campo "situacao" desabilitado e com valor "Pendente"', () => {
      const controleSituacao = component.formLancamento.get('situacao');
      expect(controleSituacao?.value).toBe('Pendente');
      expect(controleSituacao?.disabled).toBeTrue();
    });
  });

  describe('Validador Customizado: contaCorrenteValidator', () => {
    it('deve retornar null se o controle estiver vazio', () => {
      const controle = new FormControl('');
      expect(contaCorrenteValidator(controle)).toBeNull();
    });

    it('deve retornar erro "contaInvalida" se contiver letras', () => {
      const controle = new FormControl('1234A');
      expect(contaCorrenteValidator(controle)).toEqual({ contaInvalida: true });
    });

    it('deve retornar erro "contaInvalida" se tiver menos de 5 dígitos', () => {
      const controle = new FormControl('1234');
      expect(contaCorrenteValidator(controle)).toEqual({ contaInvalida: true });
    });

    it('deve retornar null se contiver 5 ou mais dígitos numéricos', () => {
      const controle = new FormControl('12345');
      expect(contaCorrenteValidator(controle)).toBeNull();
    });
  });

  describe('Método: buscarConta', () => {
    it('deve encontrar "Ana Paula Costa" quando a conta for "44444"', () => {
      component.formLancamento.patchValue({ contaCorrente: '44444' });
      component.buscarConta();
      expect(component.nomeTitularEncontrado).toBe('Ana Paula Costa');
    });

    it('deve encontrar "Cliente Não Identificado" para contas válidas diferentes de "44444"', () => {
      component.formLancamento.patchValue({ contaCorrente: '99999' });
      component.buscarConta();
      expect(component.nomeTitularEncontrado).toBe('Cliente Não Identificado');
    });

    it('deve marcar o controle como tocado se a conta for inválida e o botão lupa for clicado', () => {
      component.formLancamento.patchValue({ contaCorrente: '123' }); // Inválido (menos de 5 dígitos)
      component.buscarConta();
      expect(component.formLancamento.get('contaCorrente')?.touched).toBeTrue();
    });
  });

  describe('Ações de Fechar/Salvar', () => {
    it('deve fechar o modal vazio ao acionar cancelar()', () => {
      component.cancelar();
      expect(dialogRefSpy.close).toHaveBeenCalledWith(); // Confirma se foi chamado sem parâmetros
    });

    it('deve marcar todos os campos como tocados se salvar() for acionado com formulário inválido', () => {
      spyOn(component.formLancamento, 'markAllAsTouched');
      component.salvar();
      expect(component.formLancamento.markAllAsTouched).toHaveBeenCalled();
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('deve extrair dados brutos (incluindo desabilitados) e fechar o modal com os dados ao salvar formulário válido', () => {
      // Preenchendo o formulário com dados válidos
      component.formLancamento.patchValue({
        contaCorrente: '44444',
        valor: 150,
        historico: 'Lançamento Manual',
        estorno: false,
        documento: 'DOC-123',
        descricao: 'Teste de unidade',
        pa: '00 - PA Central'
      });

      // Simula a busca do nome
      component.nomeTitularEncontrado = 'Ana Paula Costa';

      component.salvar();

      expect(dialogRefSpy.close).toHaveBeenCalled();

      // Captura o objeto exato que foi enviado no método close()
      const dadosEnviados = dialogRefSpy.close.calls.mostRecent().args[0];

      expect(dadosEnviados.contaCorrente).toBe('44444');
      expect(dadosEnviados.nomeTitular).toBe('Ana Paula Costa');
      expect(dadosEnviados.situacao).toBe('Pendente'); // Verifica se extraiu o campo readonly via getRawValue()
    });
  });
});