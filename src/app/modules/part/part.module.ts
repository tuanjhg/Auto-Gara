import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from '@shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartListComponent } from './part-list/part-list.component';
import { PartDetailComponent } from './part-detail/part-detail.component';
import { AddPartComponent } from './add-part/add-part.component';

const routes: Route[] = [
    {
        path: '',
        component: PartListComponent,
    },
];
@NgModule({
    declarations: [PartListComponent, PartDetailComponent, AddPartComponent],
    imports: [RouterModule.forChild(routes), FuseCardModule, CommonModule, TranslocoModule, SharedModule, MatIconModule, FormsModule, ReactiveFormsModule],
})
export class PartModule {}
