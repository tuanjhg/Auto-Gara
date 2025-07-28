import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Subject, takeUntil} from 'rxjs';
import {FuseLoadingService} from '@fuse/services/loading';

@Component({
  selector: 'fuse-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'fuseLoadingBar'
})
export class FuseLoadingBarComponent implements OnChanges, OnInit, OnDestroy, AfterContentChecked {
  @Input() autoMode: boolean = true;
  mode: 'determinate' | 'indeterminate';
  progress: number = 0;
  show: boolean = false;
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  /**
   * Constructor
   */
  constructor(
    private _fuseLoadingService: FuseLoadingService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On changes
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Auto mode
    if ('autoMode' in changes) {
      // Set the auto mode in the service
      this._fuseLoadingService.setAutoMode(coerceBooleanProperty(changes.autoMode.currentValue));
    }
  }

  /**
   * After content checked
   */
  ngAfterContentChecked(): void {
    this._changeDetectorRef.detectChanges();
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the service
    this._fuseLoadingService.mode$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.mode = value;
      });

    this._fuseLoadingService.progress$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.progress = value;
      });

    this._fuseLoadingService.show$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        setTimeout(() => {
            this.show = value;
        }, 0);
        setTimeout(() => {
          if(this.show) {
            this.calculateLoadingHeight(false);
          }
      }, 1);
      });

      this._fuseLoadingService.showMenu$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        setTimeout(() => {
            this.calculateLoadingHeight(value);
          }, 100);
      });

  }

  calculateLoadingHeight(isOpenMenu: boolean): void {
    const loading = document.getElementById('loading-bar');
    if (loading) {
        const contentWidth = document.getElementById('content')?.offsetWidth || 0;
        if(contentWidth && isOpenMenu)  {
          loading.style.cssText  = `width: ${contentWidth}px !important`;
          loading.style.marginLeft  = `calc(100vw - ${contentWidth}px)`;
        } else {
          loading.style.cssText  = 'width: 100vw !important';
          loading.style.marginLeft  = '0px';
        }
    }
  }


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
