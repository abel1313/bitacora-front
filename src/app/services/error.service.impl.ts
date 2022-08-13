import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { IErrorService } from "./error.service";
import { UrlServiceService } from "./url-service.service";




export class ErrorServiceImpl implements IErrorService {
    protected readonly url = environment.AE_API_URL;
    protected readonly httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    constructor() {

    }

    handleError(error: HttpErrorResponse): any {
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

}