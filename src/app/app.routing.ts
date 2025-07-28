import { LayoutComponent } from 'app/layout/layout.component';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '404' },

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
