import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUsuarioDto } from '../home/acceso/models';
import { ErrorServiceImpl } from './error.service.impl';
import { UrlServiceService } from './url-service.service';

@Injectable()
export class ServiceGenericoService {

  mostrarFondo = new EventEmitter<boolean>();
  usuarioDto = new EventEmitter<IUsuarioDto>();

  protected readonly url = environment.AE_API_URL;
  protected readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  // constructor(
  //   protected readonly http: HttpClient
  // ) {}

  constructor(
    protected readonly http: HttpClient,
    protected readonly urlService: UrlServiceService
  ) {
  }

  public getData<R>(urlServicio: string): Observable<R> {
    const urlSer = `${this.url}/${urlServicio}`;
    // const urlSer = this.urlService.getUrl(`${this.url}/${urlServicio}`);
    return this.http.get<R>(urlSer,this.httpOptions).pipe(
      retry(3)
    );
  }
  public solicitudPost<T,R>(urlServicio: string, data: T): Observable<R> {
    const urlSer = `${this.url}/${urlServicio}`;
    // const urlSer = this.urlService.getUrl(`${this.url}/${urlServicio}`);
    return this.http.post<R>(urlSer, data, this.httpOptions).pipe(
      retry(3)
    );
  }



  /**
   * 
   * @param error 
   * @returns 
   */
  // protected handleError(error: HttpErrorResponse) {
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
