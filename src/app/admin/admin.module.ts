import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AddFeatureComponent } from './add-feature/add-feature.component';



@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AddFeatureComponent
  ], 
  exports: [
    AdminComponent, 
    AddFeatureComponent
  ],
  declarations: [AdminComponent]
})
export class AdminModule { }
