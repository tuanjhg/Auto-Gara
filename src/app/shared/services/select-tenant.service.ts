import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SelectedTenantService {
  private readonly tenantIdSubject = new BehaviorSubject<number | null>(null);
  readonly tenantId: Observable<number | null> = this.tenantIdSubject.asObservable();

  constructor(private readonly router: Router) {
    this.initializeTenantId();
  }

  getTenantId(): number | null {
    return this.tenantIdSubject.value;
  }

  setTenantId(tenantId: number | null, options: { syncUrl: boolean }): void {
    if (this.isValidTenantId(tenantId)) {
      this.tenantIdSubject.next(tenantId);
      this.updateLocalStorage(tenantId);
      if (options.syncUrl) {
        this.updateUrlQueryParam(tenantId);
      }
    } else {
      this.clear(options);
    }
  }

  clear(options: { syncUrl: boolean }): void {
    this.tenantIdSubject.next(null);
    this.updateLocalStorage(null);
    if (options.syncUrl) {
      this.updateUrlQueryParam(null);
    }
  }

  private initializeTenantId(): void {
    const tenantId = this.getTenantIdFromUrl() ?? this.getTenantIdFromStorage();
    if (this.isValidTenantId(tenantId)) {
      this.setTenantId(tenantId, { syncUrl: false });
    } else {
      this.clear({ syncUrl: false });
    }
  }

  private getTenantIdFromUrl(): number | null {
    const urlParams = new URLSearchParams(window.location.search);
    const tenantId = urlParams.get('tenant');
    return tenantId && Number.isFinite(Number(tenantId)) ? Number(tenantId) : null;
  }

  private getTenantIdFromStorage(): number | null {
    const storedValue = localStorage.getItem('selectedTenantId');
    return storedValue && Number.isFinite(Number(storedValue)) ? Number(storedValue) : null;
  }

  private isValidTenantId(tenantId: number | null): tenantId is number {
    return tenantId !== null && Number.isFinite(tenantId);
  }

  private updateLocalStorage(tenantId: number | null): void {
    if (tenantId === null) {
      localStorage.removeItem('selectedTenantId');
    } else {
      localStorage.setItem('selectedTenantId', tenantId.toString());
    }
  }

  private updateUrlQueryParam(tenantId: number | null): void {
    this.router.navigate([], {
      queryParams: { tenant: tenantId },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}