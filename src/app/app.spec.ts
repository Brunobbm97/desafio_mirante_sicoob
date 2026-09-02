import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { RouterModule } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        RouterModule.forRoot([]) // Simula o roteamento básico
      ],
    }).compileComponents();
  });

  it('deve criar o aplicativo', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});