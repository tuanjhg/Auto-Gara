import { NgModule } from '@angular/core';
import { SharedModule } from  'app/shared/shared.module';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { Route, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import  { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { VehicleDetailComponent } from './vehicle-detail/vehicle-detail.component';

const routes: Route[] = [
    {
        path     : '',
        component: VehicleListComponent 
    }
];

@NgModule({
  declarations: [
    VehicleListComponent,
    AddVehicleComponent,
    VehicleDetailComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class VehicleModule { }