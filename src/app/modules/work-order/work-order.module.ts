import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WorkOrderListComponent } from './work-order-list/work-order-list.component';
import { Route, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Route[] = [
    {
        path     : '',
        component: WorkOrderListComponent
    }
];

@NgModule({
  declarations: [
    WorkOrderListComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class WorkOrderModule { }
