import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { PaginaNoDisponibleComponent } from './layout/pagina-no-disponible/pagina-no-disponible.component';
import { AccesoModule } from './home/acceso/acceso.module';
import { ServiceGenericoService } from './services/service-generico.service';
import { BitacoraService } from './home/bitacora/bitacora.service';
import { UrlServiceService } from './services/url-service.service';
import { WINDOW_PROVIDERS } from './services/window.provider';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './services/interceptor.service';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PaginaNoDisponibleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AccesoModule
  ],
  providers: [
    ServiceGenericoService,
    BitacoraService,
    UrlServiceService,
    WINDOW_PROVIDERS,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
