import { HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";




export interface IErrorService{

     handleError(error: HttpErrorResponse): any;
}