import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { SharedModule } from 'app/shared/shared.module';
import { ClassicLayoutComponent } from 'app/layout/layouts/classic/classic.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        ClassicLayoutComponent
    ],
    imports     : [
        RouterModule,
        FuseLoadingBarModule,
        SharedModule,
        CommonModule
    ],
    exports     : [
        ClassicLayoutComponent
    ]
})
export class ClassicLayoutModule
{
}
