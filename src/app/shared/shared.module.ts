import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '../component/loading/loading.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports:[
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent,
    HttpClientModule
  ]
})
export class SharedModule { }
