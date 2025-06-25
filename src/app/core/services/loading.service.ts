import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  private delayTimeout?: any;
  private hideTimeout?: any;

  private lastShownTime: number | null = null;

  private readonly minVisibleTime = 600;
  private readonly showDelay = 0;

  show(): void {
    clearTimeout(this.delayTimeout);
    clearTimeout(this.hideTimeout);

    this.delayTimeout = setTimeout(() => {
      this.lastShownTime = Date.now();
      this.loadingSubject.next(true);
    }, this.showDelay);
  }

  hide(): void {
    const now = Date.now();

    const delayToHide = () => {
      this.loadingSubject.next(false);
      this.lastShownTime = null;
    };

    if (this.lastShownTime) {
      const elapsed = now - this.lastShownTime;
      const remaining = Math.max(this.minVisibleTime - elapsed, 0);
      this.hideTimeout = setTimeout(delayToHide, remaining);
    } else {
      const totalWait = this.showDelay + this.minVisibleTime;
      this.hideTimeout = setTimeout(delayToHide, totalWait);
    }
  }
}
