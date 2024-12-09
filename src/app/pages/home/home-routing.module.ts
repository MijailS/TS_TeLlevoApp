import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'administrar/:rut/:id',
        loadChildren: () => import('../administrar/administrar.module').then(m => m.AdministrarPageModule)
      },
      {
        path: 'perfil/:rut/:id',
        loadChildren: () => import('../perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: 'solicitud/:rut/:id',
        loadChildren: () => import('../solicitud/solicitud.module').then(m => m.SolicitudPageModule)
      },
      {
        path: 'nuevoviaje/:rut/:id',
        loadChildren: () => import('../nuevoviaje/nuevoviaje.module').then(m => m.NuevoviajePageModule)
      },

      {
        path: 'disponible/:rut/:id',
        loadChildren: () => import('../disponible/disponible.module').then(m => m.DisponiblePageModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
