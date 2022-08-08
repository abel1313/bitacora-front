import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaNoDisponibleComponent } from './pagina-no-disponible.component';

describe('PaginaNoDisponibleComponent', () => {
  let component: PaginaNoDisponibleComponent;
  let fixture: ComponentFixture<PaginaNoDisponibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginaNoDisponibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaNoDisponibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
