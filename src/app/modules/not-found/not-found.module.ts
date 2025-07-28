import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NotFoundPageComponent } from './not-found.component';
import { FuseCardModule } from '@fuse/components/card';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from '@shared/shared.module';

const routes: Route[] = [
    {
        path     : '',
        component: NotFoundPageComponent
    }
];

@NgModule({
    declarations: [
        NotFoundPageComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FuseCardModule,
        CommonModule,
        TranslocoModule,
        SharedModule
    ]
})
export class NotFoundModule
{
}
