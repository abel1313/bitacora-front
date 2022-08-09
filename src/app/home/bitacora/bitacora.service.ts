import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ServiceGenericoService } from 'src/app/services/service-generico.service';
import { IActividades, ICrDTO } from './generar-bitacora/models';

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
      nombre: "Seleccione una opción1",
    }
    datos.unshift(act);
    return datos;
  }


  public getDataCrsDto(urlServicio: string): Observable<Array<ICrDTO>> {
    const urlSer = `${this.url}/${urlServicio}`;
    return this.http.get<Array<ICrDTO>>(urlSer,this.httpOptions).pipe(
      retry(3),
      map(this.agregarSelectCr),
      catchError(this.handleError)
    );
  }
  private agregarSelectCr(datos: Array<ICrDTO>):Array<ICrDTO>{
    const cr = {
      idCr: 0,
      nombreCrNombreAsignacion: "Seleccione una opción",
      folioAsignacion: ""
    }
    datos.unshift(cr);
    return datos;
  }
}
