import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RemoverSesion } from './models/session.models';
import { ServiceGenericoService } from './services/service-generico.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  mostrarFondo: boolean;
  cssFondo = '';
  
  url: Array<any>;

  constructor(
    private readonly service: ServiceGenericoService,
    private readonly router: Router
    ) {
    this.subscription = new Subscription();
    this.mostrarFondo = false;
    this.cambiarFondo();
    this.cambiarFondoPantallas();
  }

  title = 'bitacora-minsait';



  ngOnInit() {

  }

  private cambiarFondo(): void{
    this.mostrarFondo =  sessionStorage.getItem('sessionUsuario') !== null;
  }
  private cambiarFondoPantallas(): void{
    this.service.mostrarFondo.subscribe((res: boolean)=>{
      this.mostrarFondo = res;
    },(err)=>{

    });
  }
  ngOnDestroy(): void {
    if( this.subscription != null ){
      this.subscription.unsubscribe();
    }
    if( sessionStorage.getItem('sessionUsuario') !== null ){
      RemoverSesion.removerSesion('sessionUsuario');
    }
  }
}
