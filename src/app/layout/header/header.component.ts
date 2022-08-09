import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUsuarioDto } from 'src/app/home/acceso/models';
import { RemoverSesion } from 'src/app/models/session.models';
import { ServiceGenericoService } from 'src/app/services/service-generico.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  usuario: IUsuarioDto = {
    usuario:'',
  };
  subscription: Subscription;

  imgIndra = './assets/image/icon110.jpg';
  constructor(private readonly service: ServiceGenericoService,
    private readonly router: Router,
    private readonly _ngZone: NgZone,
    ) {
    this.subscription = new Subscription();
    this.obtenerNombreUsuario();

    this.obtenerUsuario();
  }


  ngOnInit() {
  }

  private obtenerNombreUsuario(): void{

    if( sessionStorage.getItem('sessionUsuario') !== null ){
      this.usuario = 
      JSON.parse(sessionStorage.getItem('sessionUsuario'));
    }else{
      this._ngZone.run(()=> this.router.navigateByUrl('login')) ;
    }
  }

  private obtenerUsuario(): void{
   this.service.usuarioDto.subscribe((usuario: IUsuarioDto)=> {
    this.usuario = usuario;

   });
  }


  ngOnDestroy(): void {
    if( this.subscription != null ){
      this.subscription.unsubscribe();
    }

  }

}
