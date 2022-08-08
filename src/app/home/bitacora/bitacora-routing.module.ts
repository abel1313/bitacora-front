import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerarBitacoraComponent } from './generar-bitacora/generar-bitacora.component';


const routes: Routes = [
  {
    path: '', component: GenerarBitacoraComponent
  },
  {
    path: 'guardar', component: GenerarBitacoraComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BitacoraRoutingModule { }
