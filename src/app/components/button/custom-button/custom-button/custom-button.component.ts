import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.scss',
})
export class CustomButtonComponent {
  @Input() public text = '';
  @Input() public disabled = false;
  @Input() public styles = 'bg-darkBlue-200 hover:bg-darkBlue-300 text-gray-50';
  @Input() public icon = '';
  @Input() public customIcon = '';
  @Output() public onClick = new EventEmitter<void>();

  public get joinedStyles() {
    return `flex rounded-sm text-sm w-full justify-around justify-items-center items-center px-2 py-1 font-inter rounded border-solid border border-gray-350 ${this.styles}`;
  }
}
