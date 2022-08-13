import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ErrorServiceImpl } from 'src/app/services/error.service.impl';
import { UrlServiceService } from 'src/app/services/url-service.service';
import { environment } from 'src/environments/environment';
import { IActividades, IAsignacionAndCrDto, ICrDTO } from './generar-bitacora/models';
import { ICrDTOAsigMap, ICrDTOAsignacionMap } from './generar-bitacora/models/IAsignacionAndCrDto';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService{

  protected readonly url = environment.AE_API_URL;
  protected readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor(
    protected readonly http: HttpClient,
    protected readonly urlService: UrlServiceService
    ) { 
  }

  
  // constructor(
  //   protected readonly http: HttpClient
  //   ) { 
  //   super(http);
  // }


  public getDataActividadDto(urlServicio: string): Observable<Array<IActividades>> {
    const urlSer =`${this.url}/${urlServicio}`;
    // const urlSer = this.urlService.getUrl(`${this.url}/${urlServicio}`);
    return this.http.get<Array<IActividades>>(urlSer,this.httpOptions).pipe(
      retry(3),
      map(this.agregarSelectActividad),
    );
  }
  private agregarSelectActividad(datos: Array<IActividades>):Array<IActividades>{
    const act = {
      id: 0,
      nombre: "Seleccione una opción",
    }
    datos.unshift(act);
    return datos;
  }

  public getDataAsignacionDto(urlServicio: string): Observable<Array<ICrDTOAsignacionMap>> {
    const urlSer =`${this.url}/${urlServicio}`;
    // const urlSer = this.urlService.getUrl(`${this.url}/${urlServicio}`);
    return this.http.get<Array<IAsignacionAndCrDto>>(urlSer,this.httpOptions).pipe(
      retry(3),
      map(this.agregarSelectAsignacion),
    );
  }
  private agregarSelectAsignacion(datos: Array<IAsignacionAndCrDto>):Array<ICrDTOAsignacionMap>{

    return datos.map(m=>{
      return{
        id: m.idCr,
        idAsig: m.asignacionesDTO.id,
        idCr: m.crDTO.idCr,
        nombreAsignacion: m.asignacionesDTO.nombreAsignacion,
        numeroAsignacion: m.asignacionesDTO.numeroAsignacion
      }
      
    }); 
  }


  public getDataCrsDto(urlServicio: string): Observable<Array<ICrDTOAsigMap>> {
    const urlSer = `${this.url}/${urlServicio}`;
    // const urlSer = this.urlService.getUrl(`${this.url}/${urlServicio}`);
    return this.http.get<Array<IAsignacionAndCrDto>>(urlSer,this.httpOptions).pipe(
      retry(3),
      map(this.agregarSelectCr)
    );
  }
  private agregarSelectCr(datos: Array<IAsignacionAndCrDto>):Array<ICrDTOAsigMap>{
    return datos.filter(f=>f.crDTO.nombreCrNombreAsignacion !== '').map(m=>{
      return{
        id: m.idCr,
        idCr: m.crDTO.idCr,
        nombreCrNombreAsignacion: m.crDTO.nombreCrNombreAsignacion,
        idAsig: m.asignacionesDTO.id,
      }
      
    }); 
  }

    /**
   * 
   * @param error 
   * @returns 
   */
    //  protected handleError(error: HttpErrorResponse) {
    //   if (error.status === 0) {
    //     // A client-side or network error occurred. Handle it accordingly.
    //     console.error('An error occurred:', error.error);
    //   } else {
    //     // The backend returned an unsuccessful response code.
    //     // The response body may contain clues as to what went wrong.
    //     console.error(
    //       `Backend returned code ${error.status}, body was: `, error.error);
    //   }
    //   // Return an observable with a user-facing error message.
    //   return throwError(error);
    // }

}
