import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { APP_BASE_HREF } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'material',
    loadChildren: () => import('./material/material.module').then(m => m.MaterialModule)
  },
  {
    path: 'page3',
    loadChildren: () => import('./page3/page3.module').then(m => m.Page3Module)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // @ts-ignore
  providers: [{ provide: APP_BASE_HREF, useValue: window.__MICRO_APP_BASE_ROUTE__ || '/micro-app/angular14/'}]
})
export class AppRoutingModule { }
