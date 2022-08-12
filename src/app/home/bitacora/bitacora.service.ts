import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ServiceGenericoService } from 'src/app/services/service-generico.service';
import { IActividades, IAsignacionAndCrDto, ICrDTO } from './generar-bitacora/models';
import { ICrDTOAsigMap, ICrDTOAsignacionMap } from './generar-bitacora/models/IAsignacionAndCrDto';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService extends ServiceGenericoService {

  constructor(protected readonly http: HttpClient) { 
    super(http);
  }

  public getDataActividadDto(urlServicio: string): Observable<Array<IActividades>> {
    const urlSer = `${this.url}/${urlServicio}`;
    return this.http.get<Array<IActividades>>(urlSer,this.httpOptions).pipe(
      retry(3),
      map(this.agregarSelectActividad),
      catchError(this.handleError)
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
    const urlSer = `${this.url}/${urlServicio}`;
    return this.http.get<Array<IAsignacionAndCrDto>>(urlSer,this.httpOptions).pipe(
      retry(3),
      map(this.agregarSelectAsignacion),
      catchError(this.handleError)
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
    return this.http.get<Array<IAsignacionAndCrDto>>(urlSer,this.httpOptions).pipe(
      retry(3),
      map(this.agregarSelectCr),
      catchError(this.handleError)
    );
  }
  private agregarSelectCr(datos: Array<IAsignacionAndCrDto>):Array<ICrDTOAsigMap>{
    return datos.map(m=>{
      return{
        id: m.idCr,
        idCr: m.crDTO.idCr,
        nombreCrNombreAsignacion: m.crDTO.nombreCrNombreAsignacion,
        idAsig: m.asignacionesDTO.id,
      }
      
    }); 
  }
}
