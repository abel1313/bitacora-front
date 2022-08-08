import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './home/acceso/login/login.component';
import { PaginaNoDisponibleComponent } from './layout/pagina-no-disponible/pagina-no-disponible.component';


const routes: Routes = [

  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: 'login', 
    loadChildren: ()=>import('./home/acceso/acceso.module').then(l=> l.AccesoModule)
  },
  {
    path: 'bitacora', 
    loadChildren: ()=>import('./home/bitacora/bitacora.module').then(b=> b.BitacoraModule)
  },
  { path: '**', component: PaginaNoDisponibleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
