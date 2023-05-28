import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialRoutingModule } from './material-routing.module';
import { MaterialComponent } from './material.component';

import { MaterialExampleModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MaterialComponent
  ],
  imports: [
    CommonModule,
    MaterialRoutingModule,
    MaterialExampleModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class MaterialModule { }
