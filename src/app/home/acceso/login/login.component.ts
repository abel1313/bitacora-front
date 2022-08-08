import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { urlServer } from 'src/app/models/datos.enum';
import { RemoverSesion } from 'src/app/models/session.models';
import { ServiceGenericoService } from 'src/app/services/service-generico.service';
import Swal from 'sweetalert2';
import { IUsuario, IUsuarioDto } from '../models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  mostrarLoading = false;
  formUsuario: FormGroup;
  iUsuario: IUsuario;
  constructor(
    private readonly service: ServiceGenericoService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly _ngZone: NgZone,
  ) { 
    this.subscription = new Subscription();
  }

  ngOnInit() {

    this.verificarSession();
    this.formUsuario = this.fb.group({
      usuario: ['',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ]
    });
  }

  private convertirMayusculas(val: string ): string{
    return val.toUpperCase()
  }
  accederSIstema(): void {

    this.mostrarLoading = true;
    const usu = {
      usuario: this.formUsuario.get('usuario').value.toUpperCase()
    }
      this.subscription.add(
        this.service.solicitudPost<IUsuario,IUsuarioDto>(urlServer.LOGIN, usu)
        .subscribe((res: IUsuarioDto) => {
          Swal.fire({
            title: `Bienvenido ${res.usuario}`,
            text: '',
            imageUrl: 'assets/image/fondo.jpg',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Bienvenido',
            showConfirmButton: false
          });

          this.mostrarLoading = false;
          this._ngZone.run(() => this.router.navigateByUrl('bitacora'));
          this.service.usuarioDto.emit(res);
          sessionStorage.setItem('sessionUsuario', JSON.stringify(res));
         


        }, (error: any) => {
          this.mostrarLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Mensaje',
            text: error.error.message ,
            showConfirmButton: false
          });
          console.log(error, "Error");
        })
      );

  }


  private verificarSession(){
    if( sessionStorage.getItem('sessionUsuario') !== null ){
      this._ngZone.run(()=> this.router.navigateByUrl('bitacora')) ;
    }

  }
  ngOnDestroy(): void {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }

  }
}
