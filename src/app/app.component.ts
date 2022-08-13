import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RemoverSesion } from './models/session.models';
import { ServiceGenericoService } from './services/service-generico.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  
 
  constructor(
    ) {
console.log(environment.AE_API_URL);
  }




  ngOnInit() {

  }


 
}
