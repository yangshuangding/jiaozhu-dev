import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page3Component } from './page3.component';

const routes: Routes = [{ path: '', component: Page3Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Page3RoutingModule { }
