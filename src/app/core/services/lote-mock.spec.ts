import { TestBed } from '@angular/core/testing';

import { LoteMock } from './lote-mock';

describe('LoteMock', () => {
  let service: LoteMock;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoteMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
