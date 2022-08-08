import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { PaginaNoDisponibleComponent } from './layout/pagina-no-disponible/pagina-no-disponible.component';
import { AccesoModule } from './home/acceso/acceso.module';
import { LoadingComponent } from './component/loading/loading.component';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
