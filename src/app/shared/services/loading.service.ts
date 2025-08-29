import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  public loading$ = new BehaviorSubject<boolean>(false);

  show(): void { this.loading$.next(true); }
  hide(): void { this.loading$.next(false); }
}
