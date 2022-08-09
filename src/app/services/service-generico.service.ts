import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { IUsuario, IUsuarioDto } from '../home/acceso/models';
import { IGuardar } from '../home/bitacora/generar-bitacora/models';

@Injectable({
  providedIn: 'root'
})
export abstract class ServiceGenericoService {

  mostrarFondo = new EventEmitter<boolean>();
  usuarioDto = new EventEmitter<IUsuarioDto>();

  protected readonly url = 'http://127.0.0.1:8080/minsait';
  protected readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor(
    protected readonly http: HttpClient
  ) {

  }

  public getData<R>(urlServicio: string): Observable<R> {
    const urlSer = `${this.url}/${urlServicio}`;
    return this.http.get<R>(urlSer,this.httpOptions).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  public solicitudPost<T,R>(urlServicio: string, data: T): Observable<R> {
    const urlSer = `${this.url}/${urlServicio}`;
    return this.http.post<R>(urlSer, data, this.httpOptions).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }



  /**
   * 
   * @param error 
   * @returns 
   */
  protected handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(error);
  }



  /**
 * dummy eliminiar al final
 */

 public getDataDummy<R>(urlServicio: string): Observable<R> {
  return this.http.get<R>(urlServicio,this.httpOptions).pipe(
    retry(3),
    catchError(this.handleError)
  );
}
public solicitudPostDummyLogin(urlServicio: string, data: IUsuario): Observable<IUsuarioDto> {
  let usuario: IUsuarioDto = {
      id: 1,
      usuario: data.usuario
  }
  return of(usuario)
}



public solicitudPostDummyGuardarBitacora(urlServicio: string, data: IGuardar): Observable<string> {
  return of('Se guardo correctamente');
}

/**
  * dummy eliminiar al final
 */


}
