import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './image-input.component.html',
  styleUrl: './image-input.component.scss',
})
export class ImageInputComponent {
  @Input() public imageUrl: string | null = null;

  public onFileChange(event: EventTarget | null) {
    const target = event as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = e => {
        const target = e.target as FileReader;
        const result = target.result as string;

        this.imageUrl = result;
      };

      reader.readAsDataURL(file);
    }
  }
}
