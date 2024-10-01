import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CustomButtonComponent } from '@app/components/button/custom-button/custom-button/custom-button.component';
import { ActiveFilter } from '@app/shared/interfaces/core/menu.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, CustomButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() public title? = '';

  @Output() public filterEvent = new EventEmitter<ActiveFilter>();

  public filterEnergySensorActive = signal<boolean>(false);
  public filterCriticalSensorActive = signal<boolean>(false);

  public get activeStyle() {
    return 'bg-darkBlue-200 hover:bg-darkBlue-300 text-gray-50';
  }

  public onClickFilterCriticalSensor() {
    this.filterCriticalSensorActive.set(!this.filterCriticalSensorActive());
    this.emitEventProps();
  }

  public onClickFilterEnergySensor() {
    this.filterEnergySensorActive.set(!this.filterEnergySensorActive());
    this.emitEventProps();
  }

  private emitEventProps() {
    this.filterEvent.emit({
      energy: this.filterEnergySensorActive(),
      critical: this.filterCriticalSensorActive(),
    });
  }
}
