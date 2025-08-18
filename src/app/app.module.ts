import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';

import { APP_BASE_HREF } from '@angular/common';
import { AppComponent } from 'app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from 'app/core/core.module';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseModule } from '@fuse';
import { LayoutModule } from 'app/layout/layout.module';
import { NgModule } from '@angular/core';
import { appConfig } from 'app/core/config/app.config';
import { appRoutes } from 'app/app.routing';
import { HttpClientModule } from '@angular/common/http';


const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    useHash: false,
};

@NgModule({
    declarations: [
        AppComponent,
        
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [{provide: APP_BASE_HREF, useValue: '/'}],
})
export class AppModule {
}
