import { TestBed } from '@angular/core/testing';

import { BitacoraService } from './home/bitacora/bitacora.service';

describe('BitacoraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BitacoraService = TestBed.get(BitacoraService);
    expect(service).toBeTruthy();
  });
});
