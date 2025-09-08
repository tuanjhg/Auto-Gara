import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

export interface ImageGalleryData {
  main?: string;
  thumbnails?: string[];
}

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html'
})
export class ImageGalleryComponent implements OnInit, OnChanges {
  @Input() images: ImageGalleryData | null = null;
  @Input() isEditMode: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() validationErrors: Record<string, string> = {};
  @Input() defaultImage: string = 'https://placehold.co/600x400/e5e7eb/6b7280/png?text=No+Image+Available';

  @Output() imageSelected = new EventEmitter<number>();
  @Output() imageUpload = new EventEmitter<File[]>();
  @Output() imageError = new EventEmitter<void>();

  displayImage: string = '';
  selectedImageIndex: number = 0;
  hasImageError: boolean = false;

  ngOnInit(): void {
    this.setDisplayImage(this.images?.main);
  }

  ngOnChanges(): void {
    if (this.images?.main && this.displayImage !== this.images.main) {
      this.setDisplayImage(this.images.main);
    }
  }

  setDisplayImage(imageUrl?: string): void {
    this.hasImageError = false;
    if (imageUrl && imageUrl !== this.defaultImage) {
      const img = new Image();
      img.onload = () => {
        this.displayImage = imageUrl;
      };
      img.onerror = () => {
        this.onImageError();
      };
      img.src = imageUrl;
    } else {
      this.displayImage = this.defaultImage;
    }
  }

  onImageError(): void {
    this.hasImageError = true;
    this.displayImage = this.defaultImage;
    this.imageError.emit();
  }

  hasValidImage(): boolean {
    return !this.hasImageError && this.displayImage !== this.defaultImage;
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
    if (this.images?.thumbnails?.[index]) {
      this.setDisplayImage(this.images.thumbnails[index]);
      this.imageSelected.emit(index);
    }
  }

  onImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setDisplayImage(e.target?.result as string);
      };
      reader.readAsDataURL(validFiles[0]);
      this.imageUpload.emit(validFiles);
    }
  }
}