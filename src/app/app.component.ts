import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CompaniesService } from '@app/shared/services/companies';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <router-outlet></router-outlet>
    <div class="loading" *ngIf="loadingStatus | async">
      <i class="fa fa-circle-o-notch fa-spin"></i>
    </div>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  private companiesService = inject(CompaniesService);
  private changeRef = inject(ChangeDetectorRef);

  public async ngOnInit() {
    this.changeRef.detectChanges();
    this.companiesService.isLoading$.subscribe(() => {
      this.changeRef.detectChanges();
    });
  }

  public get loadingStatus() {
    return this.companiesService.isLoading$;
  }

  public ngOnDestroy(): void {
    this.companiesService.isLoading$.unsubscribe();
  }
}
