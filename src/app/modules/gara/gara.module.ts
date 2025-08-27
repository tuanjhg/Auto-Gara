import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from '@shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GaraListComponent } from './gara-list/gara-list.component';
import { GaraDetailComponent } from './gara-detail/gara-detail.component';
import { AddGaraComponent } from './add-gara/add-gara.component';

const routes: Route[] = [
    {
        path: '',
        component: GaraListComponent

    },

];
@NgModule({
    declarations: [
        GaraListComponent,
        GaraDetailComponent,
        AddGaraComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FuseCardModule,
        CommonModule,
        TranslocoModule,
        SharedModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class garaModule {
}
