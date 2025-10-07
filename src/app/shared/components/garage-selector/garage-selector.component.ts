import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { GaraService } from 'app/_services/gara.service';
import { GaraApiItem } from 'app/_models/gara.model';
import { PaginatedResponse } from 'app/_models/api.model';
import { SelectedTenantService } from '../../services/select-tenant.service';

export interface GarageSelectionEvent {
  garaId: string | number;
  gara?: GaraApiItem | null;
}

@Component({
  selector: 'app-garage-selector',
  templateUrl: './garage-selector.component.html',
  styleUrls: ['./garage-selector.component.scss']
})
export class GarageSelectorComponent implements OnInit, OnDestroy {
  @Input() selectedGaraId: string | number = 'all';
  @Input() userRole: string = '';
  @Input() containerClass: string = 'flex items-center bg-white rounded-lg border border-gray-200 shadow px-2 py-1 w-[280px]';
  @Input() labelText: string = 'Show:';
  @Input() allGaraText: string = 'All Gara';

  @Output() garaSelected = new EventEmitter<GarageSelectionEvent>();
  @Output() garaLoaded = new EventEmitter<GaraApiItem[]>();

  garaList: GaraApiItem[] = [];
  filteredGaraList: GaraApiItem[] = [];
  garaSelectionForm: FormGroup;
  isSearching: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private garaService: GaraService,
    private selectedTenant: SelectedTenantService,
    private formBuilder: FormBuilder,
  ) {
    this.garaSelectionForm = this.formBuilder.group({
      selectedGaraId: [this.selectedGaraId],
      searchText: ['']
    });
  }

  get selectedGaraName(): string {
    if (this.selectedGaraId === 'all') {
      return this.allGaraText;
    }
    const garaFound = this.garaList.find(gara => gara.tenant_id === this.selectedGaraId);
    return garaFound ? garaFound.name : '';
  }

  get garaSearchControl(): FormControl {
    return this.garaSelectionForm.get('searchText') as FormControl;
  }

  get selectedGaraControl(): FormControl {
    return this.garaSelectionForm.get('selectedGaraId') as FormControl;
  }

  ngOnInit(): void {
    this.garaSelectionForm.patchValue({ selectedGaraId: this.selectedGaraId });
    this.loadGara();
    const initTenant = this.selectedTenant.getTenantId();
    this.selectedGaraId = initTenant != null ? initTenant : 'all';
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterGara(search: string): void {
    if (this.userRole !== 'admin') {
      return;
    }
    this.isSearching = true;
    this.garaService.getPaginated({
      pageNumber: 1,
      rowsPerPage: 100,
      search: search || undefined,
      order: 'asc',
    }).subscribe({
      next: (res: PaginatedResponse<GaraApiItem>) => {
        const results = res.data?.rows || [];
        this.filteredGaraList = results;
        this.isSearching = false;
      },
      error: () => {
        this.filteredGaraList = [];
        this.isSearching = false;
      }
    });
  }

  selectGaraByValue(value: string | number): void {
    if (this.userRole !== 'admin') {
      return;
    }

    this.selectedGaraId = value;

    if (this.garaSelectionForm.get('selectedGaraId')?.value !== value) {
      this.garaSelectionForm.patchValue({ selectedGaraId: value }, { emitEvent: false });
    }

    if (value === 'all') {
      this.selectGara({ value: 'all', label: this.allGaraText });
    } else {
      const selectedGara = this.garaList.find(gara => gara.tenant_id === value);
      this.selectGara(selectedGara);
    }
  }

  selectGara(gara: GaraApiItem | { value: 'all'; label: string } | undefined): void {
    let selectedId: string | number;
    let selectedGara: GaraApiItem | null = null;

    if (gara && 'tenant_id' in gara) {
      selectedId = gara.tenant_id;
      selectedGara = gara;
    } else if (gara && 'value' in gara) {
      selectedId = gara.value;
    } else {
      selectedId = 'all';
    }

    this.selectedGaraId = selectedId;
    this.selectedTenant.setTenantId(
      this.selectedGaraId === 'all' ? null : Number(this.selectedGaraId),
      { syncUrl: true }
    );
    this.garaSelected.emit({
      garaId: selectedId,
      gara: selectedGara
    });
  }

  loadGara(): void {
    this.garaService.getAllGara().subscribe({
      next: (res: PaginatedResponse<GaraApiItem>) => {
        this.garaList = res.data?.rows || [];
        this.filterGara(this.garaSelectionForm.get('searchText')?.value || '');
        this.garaLoaded.emit(this.garaList);

        if (this.selectedGaraId !== 'all' && this.selectedGaraId !== null) {
          this.selectGaraByValue(this.selectedGaraId);
        } else {
          this.selectedGaraId = 'all';
          this.selectedTenant.setTenantId(null, { syncUrl: true });
        }
      },
      error: () => {
        this.garaList = [];
        this.filteredGaraList = [];
        this.selectedGaraId = 'all';
        this.selectedTenant.setTenantId(null, { syncUrl: true });
        this.garaLoaded.emit([]);
      }
    });
  }

  trackByTenant = (index: number, gara: GaraApiItem): number => gara.tenant_id;

  private setupFormSubscriptions(): void {
    this.garaSelectionForm.get('searchText')?.valueChanges
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$)
      )
      .subscribe((search) => {
        this.filterGara(typeof search === 'string' ? search : '');
      });
    this.garaSelectionForm.get('selectedGaraId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((garaId) => {
        if (garaId !== this.selectedGaraId) {
          this.selectGaraByValue(garaId);
        }
      });
  }
}
