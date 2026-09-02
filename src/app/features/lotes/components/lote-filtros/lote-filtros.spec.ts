import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { LoteFiltrosComponent } from './lote-filtros';

describe('LoteFiltrosComponent', () => {
  let component: LoteFiltrosComponent;
  let fixture: ComponentFixture<LoteFiltrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoteFiltrosComponent,
        ReactiveFormsModule,
        // Essencial para o MatExpansionModule e MatDatepickerModule não falharem no teste
        BrowserAnimationsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoteFiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara o ciclo de vida inicial
  });

  describe('Inicialização', () => {
    it('deve criar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve inicializar o formulário com os valores padrão corretos', () => {
      expect(component.formFiltros).toBeDefined();
      expect(component.formFiltros.get('situacaoLote')?.value).toBe('Todas');
      expect(component.formFiltros.get('idLoteDe')?.value).toBeNull();
    });
  });

  describe('Método: emitirPesquisa', () => {
    it('deve emitir os valores do formulário através do aoPesquisar se for válido', () => {
      spyOn(component.aoPesquisar, 'emit');

      // Limpa possíveis erros e injeta valores de simulação
      component.formFiltros.setErrors(null);
      component.formFiltros.patchValue({
        instituicaoResp: '0001 - SICOOB',
        situacaoLote: 'Aberto',
        idLoteDe: 1
      });

      component.emitirPesquisa();

      // Verifica se o objeto emitido é exatamente o que está no formulário
      expect(component.aoPesquisar.emit).toHaveBeenCalledWith(component.formFiltros.value);
    });

    it('NÃO deve emitir os valores se o formulário for inválido', () => {
      spyOn(component.aoPesquisar, 'emit');

      // Injeta forçadamente um erro no nível do FormGroup para torná-lo inválido
      component.formFiltros.setErrors({ formularioInvalido: true });

      component.emitirPesquisa();

      // O método emitirPesquisa possui um `if (this.formFiltros.valid)`, 
      // logo, o emit não deve ser alcançado.
      expect(component.aoPesquisar.emit).not.toHaveBeenCalled();
    });
  });
});