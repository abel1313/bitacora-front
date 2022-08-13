import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  
  public validateData(data) {
    return data !== null && data !== undefined && data !== '';
  }

}
