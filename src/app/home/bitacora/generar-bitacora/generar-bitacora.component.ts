import { Component, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { urlServer } from 'src/app/models/datos.enum';
import { IRespuestGenerica } from 'src/app/models/IRespuestaGenerica';
import { ServiceGenericoService } from 'src/app/services/service-generico.service';
import Swal from 'sweetalert2';
import { IUsuario, IUsuarioDto } from '../../acceso/models';
import { BitacoraService } from '../bitacora.service';
import { IActividades, ICrDTO, IGenerarReporte, IGuardar, IMesesDTO, IMostrarReporte, IRegistoActividad, ValidatorsForm } from './models';

@Component({
  selector: 'app-generar-bitacora',
  templateUrl: './generar-bitacora.component.html',
  styleUrls: ['./generar-bitacora.component.scss']
})
export class GenerarBitacoraComponent implements OnInit, OnDestroy {


  subscription: Subscription;
  usuario: IUsuarioDto;

  nombreUsuario = '';
  folio = '';
  guardar: IGuardar;

  generarReporte: IGenerarReporte = {
    index: 15,
    usuario: {
      usuario: ''
    }
  }

  horasValidas: IValidarHora = {
    horasValidas: false,
    mensaje: ''
  }


  valorMes: IMesesDTO = {
    diasMes: 0,
    index: 0,
    nombreMes: ''
  };

  iActividades: Array<IActividades> = [];
  comboCr: Array<ICrDTO> = [];

  mostraBoton: IMostrarReporte;

  mostrarLoading = false;

  mostrarReporte = false;

  formBitacora: FormGroup;

  formReporte: FormGroup;
  constructor(
    private readonly service: BitacoraService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly _ngZone: NgZone
  ) {
    this.subscription = new Subscription();
    this.obtenerNombreUsuario();

    this.obtenerActividad();
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
      cr: [0,
        [
          ValidatorsForm.validarCr
        ]
      ],
      fecha:
        ['',
          [
            Validators.required,
            ValidatorsForm.validarFecha
          ]
        ],
      hora: ['',
        [
          Validators.required,
          Validators.pattern('[1-9]'),
          ValidatorsForm.validarHora,

        ]
      ],
      notas: ['', [Validators.required]],
    });
  }

  keyValidar(hora: string) {
    this.formBitacora.updateValueAndValidity();
    const expresion = '[1-8]';
    const reg = new RegExp(expresion);
    if (hora! && reg.test(hora) && this.formBitacora.get('fecha').value !== '') {
      this.horasValida(parseInt(hora));
    }

  }
  updateDate(): void {
    this.horasValida(this.formBitacora.get('hora').value);
  }
  changeFolio(): void {
    const crt = this.comboCr.find(f => f.idCr == this.formBitacora.get('cr').value);
    this.folio = crt.folioAsignacion !== '' ? `Folio ${crt.folioAsignacion}` : '';
  }

  guardarRegistro(): void {


    this.guardar = this.formBitacora.value;
    this.guardar.fecha = this.convertDate(new Date(this.guardar.fecha));
    this.guardar.colaborador = this.formBitacora.get('colaborador').value;
    this.guardar.usuario = this.usuario;
    this.mostrarLoading = true;
    this.subscription.add(
      this.service.solicitudPost<IGuardar, IRespuestGenerica<IActividades>>
        (urlServer.GUARDAR_REGISTRO, this.guardar).subscribe((res) => {
          if (res.code === 201) {
            Swal.fire({
              icon: 'success',
              title: 'Mensaje',
              text: res.mensaje,
              showConfirmButton: false
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Mensaje',
              text: res.mensaje,
              showConfirmButton: false
            });
          }

          this.resetForm();
          this.mostrarLoading = false;
          this.folio = '';
        }, (error => {

          Swal.fire({
            icon: 'error',
            title: 'Mensaje',
            text: 'Ocurrío un error, intente de nuevo',
            showConfirmButton: false
          });
          this.mostrarLoading = false;
          this.resetForm();
        }))
    );

  }


  obtenerMes(): void {
    const mes = this.formReporte.value;
    this.generarReporte = {
      index: mes.seleccionarMes,
      usuario: this.usuario
    }
    this.subscription.add(
      this.service.solicitudPost<IGenerarReporte, any>(urlServer.GENERAR_REPORTE, this.generarReporte).subscribe((res: any) => {
       
        if (res.base64Dto!) {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje',
            text: "Se generó el reporte correctamente",
            showConfirmButton: false
          });
          this.descargarExcel(this.base64ToBlob(res.base64Dto), res.nombreDocumento, "xls");

        } else {
          Swal.fire({
            icon: 'info',
            title: 'Mensaje',
            text: "No existe información para el mes seleccionado",
            showConfirmButton: false
          });
        }


      }, (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Mensaje',
          text: "Ocurrío un error al descargar el excel",
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

  private obtenerActividad(): void {

    this.subscription.add(
      this.service.getDataActividadDto(urlServer.COMBO_OBTENER_ACTIVIDADES).subscribe((actividades) => {
        this.iActividades = actividades;
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Mensaje',
          text: 'Ocurrío un error, intente de nuevo',
          showConfirmButton: false
        });
      })
    );
  }

  private obtenerCr(): void {
    this.subscription.add(
      this.service.getDataCrsDto(urlServer.COMBO_OBTENER_CRS).subscribe((crs) => {
        this.comboCr = crs;
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Mensaje',
          text: 'Ocurrío un error, intente de nuevo',
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
          text: 'Ocurrío un error, intente de nuevo',
          showConfirmButton: false
        });
      })
    );
  }

  private resetForm(): void {
    this.formBitacora.reset();
    this.formBitacora.get('colaborador').setValue(this.usuario.usuario);
    this.formBitacora.get('actividad').setValue(0);
    this.formBitacora.get('cr').setValue(0);
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
        //type: “application/vnd.openxmlformats-officedocument.spreadsheetml.sheet”
        type: 'application/vnd.ms-excel'
      });

    const fileUrl = window.URL.createObjectURL(blob);
    this.download(fileUrl, nombreDocumento, ext);
  }
  download(base64String: string, fileName: string, ext: string) {
    const source = `${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.${ext}`
    link.click();
  }

  public base64ToBlob(b64Data, sliceSize = 512) {
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
            this.formBitacora.controls['hora'].setValidators(this.validH )
            this.formBitacora.controls['hora'].updateValueAndValidity();
          }else{
            this.formBitacora.controls['hora'].clearValidators();
            this.formBitacora.controls['hora'].updateValueAndValidity();
          }
          
        })
    );
  }

  public validH(): ValidationErrors | null {
    return this.horasValidas! && !this.horasValidas.horasValidas ? null : { mostrarHoraInvalida: true };
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


