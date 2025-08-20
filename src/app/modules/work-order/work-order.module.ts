import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WorkOrderListComponent } from './work-order-list/work-order-list.component';
import { Route, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddWorkOrderComponent } from './add-work-order/add-work-order.component';
import { WorkOrderDetailComponent } from './work-order-detail/work-order-detail.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const routes: Route[] = [
    {
        path     : '',
        component: WorkOrderListComponent
    }
];

@NgModule({
  declarations: [
    WorkOrderListComponent,
    AddWorkOrderComponent,
    WorkOrderDetailComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule
  ]
})
export class WorkOrderModule { }
