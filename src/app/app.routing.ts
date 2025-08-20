import { LayoutComponent } from 'app/layout/layout.component';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [

    { path: '', pathMatch: 'full', redirectTo: 'login' },

    {
        path: 'login',
        loadChildren: () => import('app/modules/login/login.module').then(m => m.LoginModule)
    },

    {
        path: 'vehicle',
        component: LayoutComponent,
        data: {
            layout: 'classic',
        },
        loadChildren: () => import('app/modules/vehicle/vehicle.module').then(m => m.VehicleModule)
    },

    {
        path: 'dashboard',
        component: LayoutComponent,
        data: {
            layout: 'classic',
        },
        loadChildren: () => import('app/modules/dashboard/dashboard.module').then(m => m.DashboardModule)
    },

    {
        path :'order',
        component: LayoutComponent,
        data: {
            layout: 'classic',
        },
        loadChildren: () => import('app/modules/work-order/work-order.module').then(m => m.WorkOrderModule)
    },

    {
        path: 'gara',
        component: LayoutComponent,
        data: {
            layout: 'classic',
        },
        loadChildren: () => import('app/modules/gara/gara.module').then(m => m.garaModule)
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
