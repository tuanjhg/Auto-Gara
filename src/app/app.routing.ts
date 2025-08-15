import { LayoutComponent } from 'app/layout/layout.component';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '404' },

    {
        path: 'order',
        component: LayoutComponent,
        data: {
            layout: 'classic',
        },
        loadChildren: () => import('app/modules/work-order/work-order.module').then(m => m.WorkOrderModule)
    },

    {
        path: '404',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        loadChildren: () => import('app/modules/not-found/not-found.module').then(m => m.NotFoundModule),
    },
    {
        path: '**',
        redirectTo: '/404',
    },
];
