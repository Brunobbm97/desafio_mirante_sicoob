import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteTabela } from './lote-tabela';

describe('LoteTabela', () => {
  let component: LoteTabela;
  let fixture: ComponentFixture<LoteTabela>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteTabela]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoteTabela);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
