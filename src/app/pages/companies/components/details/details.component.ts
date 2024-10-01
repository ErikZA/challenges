import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { ImageInputComponent } from '@app/components/input/image-input/image-input.component';
import { NodeAsset } from '@app/shared/interfaces/companies';
import { CompaniesService } from '@app/shared/services/companies';

import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, SvgIconComponent, ImageInputComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  @Input() public set asset(asset: NodeAsset | null) {
    if (asset !== null && asset.id) this.loadAsset(asset);
  }

  public sensorData = signal<NodeAsset | null>(null);

  private companiesService = inject(CompaniesService);

  private async loadAsset(asset: NodeAsset) {
    // todo: implement this method
  }

  public get assetDataInfo() {
    return [
      {
        name: 'Sensor',
        data: this.sensorData()?.sensorId || 'MOCKED',
        icon: '/assets/wifi_tethering.svg',
      },
      {
        name: 'Receptor',
        data: this.sensorData()?.gatewayId || 'MOCKED',
        icon: '/assets/wifi.svg',
      },
    ];
  }

  public get customIcon() {
    if (this.sensorData()?.sensorType === 'energy') return 'assets/bolt.svg';
    else return 'assets/ellipse.svg';
  }

  public get customLocation() {
    if (this.sensorData()?.sensorType === 'energy') return 'E';
    else return 'M';
  }
}
