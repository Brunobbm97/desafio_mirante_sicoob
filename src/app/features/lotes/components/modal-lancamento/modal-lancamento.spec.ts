import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLancamento } from './modal-lancamento';

describe('ModalLancamento', () => {
  let component: ModalLancamento;
  let fixture: ComponentFixture<ModalLancamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalLancamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalLancamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
