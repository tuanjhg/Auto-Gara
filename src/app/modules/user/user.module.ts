import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserListComponent } from './user-list/user-list.component';
import { Route, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUserComponent } from './add-user/add-user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

const routes: Route[] = [
    {
        path: '',
        component: UserListComponent
    }
];

@NgModule({
  declarations: [
    UserListComponent,
    AddUserComponent,
    UserDetailComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UserModule { }
