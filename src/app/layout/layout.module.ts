
import { NgModule } from '@angular/core';
import { LayoutComponent } from 'app/layout/layout.component';
import { ClassicLayoutModule } from './layouts/classic/classic.module';
import { EmptyLayoutModule } from './layouts/empty/empty.module';
import { CommonModule } from '@angular/common';

const layoutModule=[
    ClassicLayoutModule,
    EmptyLayoutModule
];

@NgModule({
    declarations: [LayoutComponent],
    imports: [CommonModule,...layoutModule],
    exports: [LayoutComponent,...layoutModule],
})
export class LayoutModule {}
