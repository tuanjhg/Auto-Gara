import { LayoutComponent } from 'app/layout/layout.component';
import { Routes } from '@angular/router';
import { AuthGuard } from '@core/authGuard/authGuard';

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
            headerTitle: 'Vehicle',
            headerSubtitle: 'Manage your vehicles'
        },
        canActivate: [AuthGuard],
        loadChildren: () => import('app/modules/vehicle/vehicle.module').then(m => m.VehicleModule)
    },

    {
        path: 'dashboard',
        component: LayoutComponent,
        data: {
            layout: 'classic',
            headerTitle: 'Dashboard',
            headerSubtitle: 'Overview of your garage'
        },
        canActivate: [AuthGuard],
        loadChildren: () => import('app/modules/dashboard/dashboard.module').then(m => m.DashboardModule)
    },

    {
        path: 'order',
        component: LayoutComponent,
        data: {
            layout: 'classic',
            headerTitle: 'Order',
            headerSubtitle: 'Manage and track your orders'
        },
        canActivate: [AuthGuard],
        loadChildren: () => import('app/modules/work-order/work-order.module').then(m => m.WorkOrderModule)
    },

    {
        path: 'gara',
        component: LayoutComponent,
        data: {
            layout: 'classic',
            headerTitle: 'Garage',
            headerSubtitle: 'Let\'s check your Garage today'
        },
        canActivate: [AuthGuard],
        loadChildren: () => import('app/modules/gara/gara.module').then(m => m.garaModule)
    },
    {
        path: 'user',
        component: LayoutComponent,
        data: {
            layout: 'classic',
            headerTitle: 'User',
            headerSubtitle: 'User management'
        },
        canActivate: [AuthGuard],
        loadChildren: () => import('app/modules/user/user.module').then(m => m.UserModule)
    },
    {
        path: 'part',
        component: LayoutComponent,
        data: {
            layout: 'classic',
            headerTitle: 'Inventory',
            headerSubtitle: 'Parts and stock management'
        },
        canActivate: [AuthGuard],
        loadChildren: () => import('app/modules/part/part.module').then(m => m.PartModule)
    },

    {
        path: 'customer',
        component: LayoutComponent,
        data: {
            layout: 'classic',
            headerTitle: 'Customers',
            headerSubtitle: 'Customer management'
        },
        canActivate: [AuthGuard],
        loadChildren: () => import('app/modules/customer/customer.module').then(m => m.CustomerModule)
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
