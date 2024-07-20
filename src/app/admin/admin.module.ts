import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule
  ], 
  exports: [
    AdminComponent
  ],
  declarations: [AdminComponent]
})
export class AdminModule { }
