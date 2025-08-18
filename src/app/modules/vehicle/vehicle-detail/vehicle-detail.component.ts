import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { VehicleDetail } from '../../../_models/vehicle.model';
import { VehicleService } from 'app/_services/vehicle.service';
import { mockVehicleDetails } from '../../../_models/vehicle.model';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
})


export class VehicleDetailComponent implements OnChanges, OnInit {

  @Input() vehicleId ;

  @Output() closeModalRequest = new EventEmitter<void>();
  @Output() editRequest = new EventEmitter<number>();
  @Output() deleteRequest = new EventEmitter<number>();
  vehicle: VehicleDetail | null = null;
  activeTab: 'info' | 'history' = 'info';
  displayImage: string = '';

  infoFields = [];

  constructor(
    private vehicleService: VehicleService,
  ) { }

  ngOnInit(): void {

    this.vehicleService.getVehicleDetail(this.vehicleId).subscribe({
      next: (vehicleDetail: VehicleDetail) => {
        this.vehicle = vehicleDetail;
        this.displayImage = vehicleDetail.images.main;
        this.updateInfoFields();
      },
      error: () => {
        const mockDetail = this.getDetailById(this.vehicleId);
        if (mockDetail) {
          this.vehicle = mockDetail;
          this.displayImage = mockDetail.images.main;
          this.updateInfoFields();
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicle'] && this.vehicle) {
      this.displayImage = this.vehicle.images.main;
      this.updateInfoFields();
    }
  }
  updateInfoFields(): void {
    if (!this.vehicle) {
      this.infoFields = [];
      return;
    }
    this.infoFields = [
      { label: 'License Plate', value: this.vehicle.plate_number },
      { label: 'Make & Model', value: `${this.vehicle.make} ${this.vehicle.model}` },
      { label: 'Year', value: this.vehicle.year},
      { label: 'Color', value: this.vehicle.color },
      { label: 'Engine Type', value: this.vehicle.engineType },
      { label: 'Mileage', value: this.vehicle.mileage },
      { label: 'Notes', value: this.vehicle.notes, className: 'col-span-2' }
    ];
  }

  close(): void {
    this.closeModalRequest.emit();
  }

  editVehicle(): void {
    if (this.vehicle) {
      this.editRequest.emit(this.vehicle.id);
    }
  }

  getStatusStyle(status: string): string {
    switch (status) {
      case 'In Service':
        return 'bg-yellow-100 text-yellow-800';
      case 'Awaiting Parts':
        return 'bg-blue-100 text-blue-800';
      case 'Ready for Pickup':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  }

  deleteVehicle(): void {
    if (this.vehicle) {
      this.deleteRequest.emit(this.vehicle.id);
    }
  }

  getDetailById(id: number): VehicleDetail | null {

    return mockVehicleDetails.find(vehicle => vehicle.id === id) || null;
  };

  getVehicleDetail(id: number): VehicleDetail | null {
    return this.getDetailById(id);
  }

  selectTab(tab: 'info' | 'history'): void {
    this.activeTab = tab;
  }

  changeDisplayImage(imageUrl: string): void {
    this.displayImage = imageUrl;
  }
}