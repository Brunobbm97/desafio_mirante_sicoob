import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteFiltros } from './lote-filtros';

describe('LoteFiltros', () => {
  let component: LoteFiltros;
  let fixture: ComponentFixture<LoteFiltros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteFiltros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoteFiltros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
