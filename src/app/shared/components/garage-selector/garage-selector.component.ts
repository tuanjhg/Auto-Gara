import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { SelectedTenantService } from '../../services/select-tenant.service';
import { GaraService } from 'app/_services/gara.service';

export interface Tenant { tenant_id: number; name: string }
interface GaraListResponse { data?: { tenant_id: number; name: string }[] }

@Component({
  selector: 'app-garage-selector',
  templateUrl: './garage-selector.component.html',
  styleUrls: ['./garage-selector.component.scss']
})
export class GarageSelectorComponent implements OnInit {
  @Input() showAll = true;
  @Input() placeholder = 'Choose garage…';
  @Input() dense = false;
  @Output() changed = new EventEmitter<number | null>();

  tenants: Tenant[] = [];
  value: number | 'all' | null = null;

  constructor(
    private garaService: GaraService,
    private selected: SelectedTenantService,
  ) {}

  ngOnInit(): void {
    this.garaService.getAllGara().subscribe((res: GaraListResponse) => {
      this.tenants = Array.isArray(res?.data)
        ? res.data.map(gara => ({ tenant_id: gara.tenant_id, name: gara.name }))
        : [];
      const current = this.selected.getTenantId();
      this.value = (current ?? (this.showAll ? 'all' : null));
    });
  }

  onChange(value: string): void {
    const id = value === 'all' ? null : Number(value);
    this.value = value === 'all' ? 'all' : id;
  this.selected.setTenantId(id, { syncUrl: true });
    this.changed.emit(id);
  }

  trackByTenant = ( tenant: Tenant): number => tenant.tenant_id;
}
