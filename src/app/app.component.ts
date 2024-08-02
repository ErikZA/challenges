import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { HomeComponent } from './pages/home/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HomeComponent],
  template: `<app-home></app-home>`,
})
export class AppComponent {}
