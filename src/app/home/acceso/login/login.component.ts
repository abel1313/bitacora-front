import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { urlServer } from 'src/app/models/datos.enum';
import { ServiceGenericoService } from 'src/app/services/service-generico.service';
import Swal from 'sweetalert2';
import { ValidatorsForm } from '../../bitacora/generar-bitacora/models';
import { IUsuario, IUsuarioDto } from '../models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  mostrarLoading = false;
  cambiarStyleLogin =  false;

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
          Validators.minLength(2),
          ValidatorsForm.validarCorreo
        ]
      ]
    });
  }

  loginCuadro(): void{
    this.cambiarStyleLogin = true;
  }
  accederSIstema(): void {

    this.cambiarStyleLogin = false;
    this.mostrarLoading = true;
    
    let usu: IUsuario = {
      usuario: '',
      correo: ''
    }
    const reg = RegExp('[@]');
    if( !reg.test(this.formUsuario.get('usuario').value) ){
      usu.usuario = this.formUsuario.get('usuario').value.toUpperCase();
    }else{
      usu.correo = this.formUsuario.get('usuario').value.toUpperCase()
    }

      this.subscription.add(
        this.service.solicitudPost<IUsuario,IUsuarioDto>(urlServer.LOGIN, usu)
        .subscribe((res: IUsuarioDto) => {

          console.log(res, " Restaurando ");
          if( res.id != 0 ){
            Swal.fire({
              title: `Bienvenido ${res.usuario}`,
              text: '',
              imageUrl: 'assets/image/fondo.jpg',
              imageWidth: 400,
              imageHeight: 200,
              imageAlt: 'Bienvenido',
              showConfirmButton: false
            });

          
            this._ngZone.run(() => this.router.navigateByUrl('bitacora'));
            this.service.usuarioDto.emit(res);
            sessionStorage.setItem('sessionUsuario', JSON.stringify(res));

          }else{
            Swal.fire({
              icon: 'info',
              title: 'Mensaje',
              text: 'El usuario no se encontro, intente de nuevo' ,
              showConfirmButton: false
            });
          }

          this.mostrarLoading = false;
        }, (error: any) => {
          this.mostrarLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Mensaje',
            text: error.error.message ,
            showConfirmButton: false
          });
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
