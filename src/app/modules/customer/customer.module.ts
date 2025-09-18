import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { Route, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';

const routes: Route[] = [
    {
        path: '',
        component: CustomerListComponent
    }
];

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerDetailComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CustomerModule { }
