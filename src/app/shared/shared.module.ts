import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from '../component/loading/loading.component';
import { HttpClientModule } from '@angular/common/http';
import {AutoCompleteModule} from 'angular-ngx-autocomplete';

@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AutoCompleteModule
  ],
  exports:[
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent,
    HttpClientModule,
    AutoCompleteModule
  ]
})
export class SharedModule { }
