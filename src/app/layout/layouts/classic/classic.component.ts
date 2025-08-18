import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'classic-layout',
  templateUrl: './classic.component.html',
})
export class ClassicLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(
  ): void {
    
  }
    selectedFeature = 'Vehicle';

  onFeatureChange(feature: string) {
    this.selectedFeature = feature;
  }
}
