import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BitacoraRoutingModule } from './bitacora-routing.module';
import { GenerarBitacoraComponent } from './generar-bitacora/generar-bitacora.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [GenerarBitacoraComponent],
  imports: [
    CommonModule,
    BitacoraRoutingModule,
    SharedModule
  ],
  exports:[
    GenerarBitacoraComponent
  ]
})
export class BitacoraModule { }
