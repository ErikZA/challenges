import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { VirtualListComponent } from '@app/components/list/virtual-list/virtual-list.component';
import { NodeAsset, TreeOfAssets } from '@app/shared/interfaces/companies';

import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-item-drop',
  standalone: true,
  imports: [CommonModule, SvgIconComponent, VirtualListComponent],
  styleUrl: './item-drop.component.scss',
  templateUrl: './item-drop.component.html',
})
export class ItemDropComponent {
  @Input({ required: true }) public set item(data: NodeAsset | null) {
    this._subNodes = Object.values(data?.children || {});
    this._item = data;
  }
  @Input() public templateHtml: TemplateRef<{ item: TreeOfAssets }> | null =
    null;

  private _subNodes: NodeAsset[] = [];
  private _item: NodeAsset | null = null;

  public get currentItem() {
    return this._item;
  }

  public subNodes(node: NodeAsset | null) {
    return Object.values(node?.children || {}) as unknown as TreeOfAssets[];
  }

  public icon(node: NodeAsset | null) {
    switch (node?.type) {
      case 'COMPANY':
        return 'assets/GoLocation.svg';
      case 'LOCATION':
        return 'assets/GoLocation.svg';
      case 'SUB-LOCATION':
        return 'assets/GoLocation.svg';
      case 'ASSET':
        return 'assets/IoCubeOutline.svg';
      case 'SENSOR':
        return 'assets/small-box.svg';
      default:
        return '';
    }
  }

  public showArrow(node: NodeAsset | null) {
    const hasChildren = Object.values(node?.children || {}).length > 0;

    return hasChildren;
  }
}
