import { Component, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { urlServer } from 'src/app/models/datos.enum';
import { IRespuestGenerica } from 'src/app/models/IRespuestaGenerica';
import { MensajeSwal } from 'src/app/models/mensaje.mode';
import { ServiceGenericoService } from 'src/app/services/service-generico.service';
import Swal from 'sweetalert2';
import { IUsuario, IUsuarioDto } from '../../acceso/models';
import { BitacoraService } from '../bitacora.service';
import { 
  IActividades, 
  ICrDTO, 
  ICrDTOAsigMap, 
  ICrDTOAsignacionMap, 
  IGenerarReporte, 
  IGuardar, 
  IMesesDTO, 
  IMostrarFecha, 
  IMostrarReporte, 
  MensajesPersonalizados, 
  ValidatorsForm } from './models';
import { validarNotas } from './models/Validators.form';

@Component({
  selector: 'app-generar-bitacora',
  templateUrl: './generar-bitacora.component.html',
  styleUrls: ['./generar-bitacora.component.scss']
})
export class GenerarBitacoraComponent implements OnInit, OnDestroy {


  keywordCr = 'nombreCrNombreAsignacion';
  keywordAsignacion = 'nombreAsignacion';

  idAsaignError = -1;

  subscription: Subscription;
  usuario: IUsuarioDto;

  nombreUsuario = '';
  folio = '';
  guardar: IGuardar;

  generarReporte: IGenerarReporte = {
    index: 15,
    usuario: {
      usuario: '',
      permiso: ''
    }
  }

  horasValidas: IValidarHora = {
    horasValidas: false,
    mensaje: ''
  }

  horasFaltanter: IValidarHora = {
    horasValidas: false,
    mensaje: ''
  }



  valorMes: IMesesDTO = {
    diasMes: 0,
    index: 0,
    nombreMes: ''
  };

  iActividades: Array<IActividades> = [];
  comboCr: Array<ICrDTOAsigMap> = [];
  autoCompeteAsignacion: Array<ICrDTOAsignacionMap> = [];

  mostraBoton: IMostrarReporte;

  mostrarLoading = false;

  mostrarReporte = false;

  mensaje: MensajesPersonalizados;
  mostrarNotas: boolean;

  formBitacora: FormGroup;

  formReporte: FormGroup;
  constructor(
    private readonly service: ServiceGenericoService,
    private readonly servicioBitacora: BitacoraService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly _ngZone: NgZone
  ) {
    this.subscription = new Subscription();
    this.mensaje = new MensajesPersonalizados();
    this.obtenerNombreUsuario();

    this.obtenerActividad();
    this.getDataAsignacionDto();
    this.obtenerCr();
    this.mostraBoton = {
      mesesDto: [],
      mostrarBoton: false
    }

    this.mostrarBotonReporte();
  }




  ngOnInit() {

    this.formReporte = this.fb.group({
      seleccionarMes: [0, [
        Validators.required
      ]
      ]
    });

    this.formBitacora = this.fb.group({
      colaborador: [{ value: this.nombreUsuario, disabled: true },
      [
        Validators.required,
        Validators.minLength(2)
      ]
      ],
      actividad: [0,
        [
          ValidatorsForm.validarActividad
        ]
      ],
      cr: ['',
        [
          ValidatorsForm.validarCr,
        ]
      ],
      fecha:
        [this.fechaDia(),
        [
          Validators.required,
          ValidatorsForm.validarFecha
        ]
        ],
      hora: [1,
        [
          Validators.required,
          Validators.pattern('[1-9]'),
          ValidatorsForm.validarHora,

        ]
      ],
      notas: [''],
      tituloCr: ['', [Validators.required] ],
    }, {
      validators: validarNotas
    }
      );

  }

  selectEventCr(item: ICrDTO) {
      const datosCr =this.autoCompeteAsignacion.find(f=>f.idAsig ===  item.idAsig );
      this.formBitacora.get('tituloCr').setValue(datosCr);
      this.mostrarNotas = item.idCr === 1 ;
      if( item.idCr !== 1 ){
       this.formBitacora.get('notas').setValue('');
      }  
  }
  inputClearedCr(): void{
    this.formBitacora.get('tituloCr').setValue('');
  }

  selectEventAsignacion(item: ICrDTOAsignacionMap) {

    const datosAsig =this.comboCr.find(f=>f.idCr ===  item.idCr );
    this.formBitacora.get('cr').setValue(datosAsig);

    this.folio = item.numeroAsignacion !== '' ? `Folio ${item.numeroAsignacion}` : '';
     this.mostrarNotas = item.idAsig === 1 ;
     if( item.idAsig !== 1 ){
      this.formBitacora.get('notas').setValue('');
     }  
  }

  inputClearedAsignacion(): void{
    this.formBitacora.get('cr').setValue('');
  }


  keyValidar(hora: string) {
    this.formBitacora.updateValueAndValidity();
    const expresion = '[1-8]';
    const reg = new RegExp(expresion);
    console.log("fechas   ", this.formBitacora.get('fecha').value !== '');
    if (hora! && reg.test(hora) && this.formBitacora.get('fecha').value !== '') {
      this.horasValida(parseInt(hora));
      console.log("Llegando ");
    }

  }
  updateDate(): void {

    const mostrar = {
      fecha: this.formBitacora.get('fecha').value,
      usuarioDto: this.usuario
    }
    this.subscription.add(
      this.service.solicitudPost<IMostrarFecha, IValidarHora>(urlServer.HORAS_FALTANTES, mostrar).subscribe((respuesta) => {
        console.log(respuesta, " Respuesta ");
        this.horasFaltanter = respuesta;
        if (this.horasFaltanter.horasValidas) {
          Swal.fire({
            icon: 'info',
            title: 'Mensaje',
            text: this.horasFaltanter.mensaje,
            showConfirmButton: false
          });

        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Mensaje',
            text: this.horasFaltanter.mensaje,
            showConfirmButton: false
          });
        }

      }, (err) => {
        console.log(err)
      })
    );


    this.horasValida(this.formBitacora.get('hora').value);
  }
  changeFolio(): void {
    // const crt = this.comboCr.find(f => f.crDTO.idCr == this.formBitacora.get('cr').value);
    // this.folio = crt.folioAsignacion !== '' ? `Folio ${crt.folioAsignacion}` : '';
  }

  guardarRegistro(): void {
    MensajeSwal.mensajeResult(this.mensaje.mensajePerso()).then((mensajeCorrecto: boolean) => {
      console.log("Se realizo ");
      this.guardarActividad();
    }).catch((mensajeCancelado: boolean) => {

    });

  }


  obtenerMes(): void {
    console.log(this.usuario);
    const mes = this.formReporte.value;
    this.generarReporte = {
      index: mes.seleccionarMes,
      usuario: this.usuario,
    }
    this.subscription.add(
      this.service.solicitudPost<IGenerarReporte, any>(urlServer.GENERAR_REPORTE, this.generarReporte).subscribe((res: any) => {

        if (res.base64Dto!) {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje',
            text: "Se gener?? el reporte correctamente",
            showConfirmButton: false
          });
          this.descargarExcel(this.base64ToBlob(res.base64Dto), res.nombreDocumento, "xls");

        } else {
          Swal.fire({
            icon: 'info',
            title: 'Mensaje',
            text: "No existe informaci??n para el mes seleccionado",
            showConfirmButton: false
          });
        }


      }, (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Mensaje',
          text: "Ocurr??o un error al descargar el excel",
          showConfirmButton: false
        });
      })
    );

  }
  ngOnDestroy(): void {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

  private obtenerNombreUsuario(): void {

    this.service.mostrarFondo.emit(true);
    if (sessionStorage.getItem('sessionUsuario') !== null) {
      this.usuario = JSON.parse(sessionStorage.getItem('sessionUsuario'));
      // this.formBitacora.get('colaborador').setValue(this.usuario.usuario);
      this.nombreUsuario = this.usuario.usuario;
      

    } else {
      this._ngZone.run(() => this.router.navigateByUrl('login'));
    }


  }

  private guardarActividad(): void {
console.log("avtividad 1" , this.formBitacora.value);
const cr = this.formBitacora.get('cr').value;
this.guardar = {
  colaborador: this.formBitacora.get('colaborador').value,
  actividad: this.formBitacora.get('actividad').value,
  fecha: this.convertDate(new Date(this.formBitacora.get('fecha').value)),
  cr: cr.id,
  hora: this.formBitacora.get('hora').value,
  notas: this.formBitacora.get('notas').value,
  usuario: this.usuario
}
    
console.log(this.guardar, " *************************** ");

    this.mostrarLoading = true;

    this.subscription.add(
      this.service.solicitudPost<IGuardar, IRespuestGenerica<IActividades>>
        (urlServer.GUARDAR_REGISTRO, this.guardar).subscribe((res) => {

          console.log("Llegando ");
          if (res.code === 201) {
            Swal.fire({
              icon: 'success',
              title: 'Mensaje',
              text: res.mensaje,
              showConfirmButton: false
            });
          } else {
            Swal.fire({
              icon: 'info',
              title: 'Mensaje',
              text: res.mensaje,
              showConfirmButton: false
            });
          }

          this.resetForm();
          this.mostrarLoading = false;
          this.folio = '';
          this.horasFaltanter = {
            horasValidas: false,
            mensaje: ''
          }
        }, (error => {

          Swal.fire({
            icon: 'error',
            title: 'Mensaje',
            text: 'Ocurr??o un error, intente de nuevo',
            showConfirmButton: false
          });
          this.mostrarLoading = false;
          this.resetForm();
        }))
    );

  }

  private obtenerActividad(): void {

    this.subscription.add(
      this.servicioBitacora.getDataActividadDto(urlServer.COMBO_OBTENER_ACTIVIDADES).subscribe((actividades) => {
        this.iActividades = actividades;
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Mensaje',
          text: 'Ocurr??o un error, intente de nuevo',
          showConfirmButton: false
        });
      })
    );
  }

  private obtenerCr(): void {
    this.subscription.add(
      this.servicioBitacora.getDataCrsDto(urlServer.COMBO_OBTENER_CRS).subscribe((crs) => {
        this.comboCr = crs;
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Mensaje',
          text: 'Ocurr??o un error, intente de nuevo',
          showConfirmButton: false
        });
      })
    );
  }

  private getDataAsignacionDto(): void {
    this.subscription.add(
      this.servicioBitacora.getDataAsignacionDto(urlServer.COMBO_OBTENER_CRS).subscribe((complete) => {
        this.autoCompeteAsignacion = complete;
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Mensaje',
          text: 'Ocurr??o un error, intente de nuevo',
          showConfirmButton: false
        });
      })
    );
  }


  private mostrarBotonReporte(): void {
    this.subscription.add(
      this.service.solicitudPost<IUsuarioDto, IMostrarReporte>(urlServer.MOSTRAR_BOTON_COMBO, this.usuario).subscribe((res) => {
        this.mostraBoton = res;
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Mensaje',
          text: 'Ocurr??o un error, intente de nuevo',
          showConfirmButton: false
        });
      })
    );
  }

  private resetForm(): void {
    this.formBitacora.reset();
    this.formBitacora.get('hora').setValue(1);
    this.formBitacora.get('colaborador').setValue(this.usuario.usuario);
    this.formBitacora.get('actividad').setValue(0);
    this.formBitacora.get('cr').setValue('');
    this.formBitacora.get('fecha').setValue(this.fechaDia());
  }
  private convertDate(fecha: Date): string {
    const dd = fecha.getUTCDate() > 9 ? fecha.getUTCDate() : `0${fecha.getUTCDate()}`;
    const mm = (fecha.getUTCMonth() + 1) > 9 ? (fecha.getUTCMonth() + 1) : `0${(fecha.getUTCMonth() + 1)}`;
    const yyy = fecha.getFullYear();
    return `${dd}-${mm}-${yyy}`;
  }

  private descargarExcel(respuesta: Blob, nombreDocumento: string, ext: string) {
    const blob = new Blob([respuesta],
      {
        //type: ???application/vnd.openxmlformats-officedocument.spreadsheetml.sheet???
        type: 'application/vnd.ms-excel'
      });

    const fileUrl = window.URL.createObjectURL(blob);
    this.download(fileUrl, nombreDocumento, ext);
  }
  private download(base64String: string, fileName: string, ext: string) {
    const source = `${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.${ext}`
    link.click();
  }

  private base64ToBlob(b64Data, sliceSize = 512) {
    let byteCharacters = atob(b64Data); //data.file there
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  private horasValida(horas: number): void {

    const enviarDatos = {
      horas,
      fecha: this.formBitacora.get('fecha').value,
      usuarioDTO: this.usuario
    };

    this.subscription.add(
      this.service.solicitudPost<IHora, IValidarHora>(urlServer.HORAS_VALIDAS, enviarDatos)
        .subscribe((res) => {
          this.horasValidas = res;
          if (this.horasValidas.horasValidas) {
            this.formBitacora.controls['hora'].setValidators(this.validH);
          } else {
            this.formBitacora.controls['hora'].clearValidators();
          }
          this.formBitacora.controls['hora'].updateValueAndValidity();

        })
    );
  }

  public validarNotaV(): ValidationErrors | null  { 
    return this.idAsaignError !== 59 ? null : { notaRequerida: true};
  }

  public validH(): ValidationErrors | null {
    return this.horasValidas! && !this.horasValidas.horasValidas ? null : { mostrarHoraInvalida: true };
  }


  private fechaDia(): string {
    const fecha = new Date();
    const dd = fecha.getDate() > 9 ? fecha.getDate() : `0${fecha.getDate()}`;
    const MM = (fecha.getMonth() + 1) > 9 ? (fecha.getMonth() + 1) : `0${(fecha.getMonth() + 1)}`;
    const yyyy = fecha.getFullYear();
    return `${yyyy}-${MM}-${dd}`
  }



}

interface IHora {
  horas: number;
  fecha: string;
  usuarioDTO: IUsuarioDto;

}
interface IValidarHora {
  horasValidas: boolean;
  mensaje: string;
}


