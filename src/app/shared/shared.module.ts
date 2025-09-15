import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmModelComponent } from './components/confirm-model/confirm-model.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { GarageSelectorComponent } from './components/garage-selector/garage-selector.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ConfirmModelComponent,
    LoadingComponent,
    ImageGalleryComponent,
    GarageSelectorComponent
  ],
  imports: [CommonModule, RouterModule, MatIconModule,FormsModule],
  exports: [LoadingComponent, ConfirmModelComponent, ImageGalleryComponent, HeaderComponent, SidebarComponent, MatIconModule, CommonModule, GarageSelectorComponent, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
