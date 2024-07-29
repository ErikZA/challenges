import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
export class AppComponent {
  private companiesService = inject(CompaniesService);

  public get loadingStatus() {
    return this.companiesService.isLoading$;
  }
}
