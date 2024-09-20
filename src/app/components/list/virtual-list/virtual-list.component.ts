import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractListComponent } from '@app/components/list/abstract-list';
import { ItemDropComponent } from '@app/components/list/item-drop/item-drop.component';
import { NodeAsset, TreeOfAssets } from '@app/shared/interfaces/companies';

import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-virtual-list',
  standalone: true,
  imports: [CommonModule, ItemDropComponent, SvgIconComponent],
  templateUrl: './virtual-list.component.html',
  styleUrl: './virtual-list.component.scss',
})
export class VirtualListComponent extends AbstractListComponent {
  private selectedIds = new Set<string>();

  constructor() {
    super();
  }

  public subNodes(node: NodeAsset | null) {
    return Object.values(node?.children || {}) as unknown as TreeOfAssets[];
  }

  public allSubNodes(node: NodeAsset | TreeOfAssets | null) {
    const subNodes = this.subNodes(node as NodeAsset);

    return subNodes.reduce<any>((acc, subNode) => {
      const subSubNodes = this.allSubNodes(subNode);

      return [...acc, subNode, ...subSubNodes];
    }, [] as NodeAsset[]) as NodeAsset[];
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

  public isSensor(node: NodeAsset | null) {
    return node?.type === 'SENSOR' && !node?.locationId && !node?.parentId;
  }

  public showArrow(node: NodeAsset | null) {
    const hasChildren = Object.values(node?.children || {}).length > 0;

    return hasChildren;
  }

  public toggleActiveItem(item: NodeAsset | null, index: number) {
    console.log('item', item, index);
    console.time('start-end-1');

    const subNodes = this.subNodes(item).map(s => {
      return {
        ...s,
        space: (item?.space || 0) + 1,
      } as NodeAsset;
    });

    if (item && item.id && !this.selectedIds.has(item.id) && subNodes.length) {
      this.selectedIds.add(item.id);

      this.insertSubNodesAfterIndexWithoutDelete(subNodes, index);
    } else if (item && item.id && this.selectedIds.has(item.id)) {
      this.selectedIds.delete(item.id);

      this.removeSubNodes(item);
    }
    console.timeEnd('start-end-1');
  }

  public removeSubNodes(item: NodeAsset | null) {
    const subNodes = this.allSubNodes(item);

    this.formatItems = this.formatItems.filter(node => {
      const isNode = !subNodes.some(subNode => subNode.id === node.id);

      if (!isNode && node.id) {
        this.selectedIds.delete(node.id);
      }

      return isNode;
    });

    this.qtdItems = this.formatItems.length;

    this.render();
  }

  public insertSubNodesAfterIndexWithoutDelete(
    subNodes: TreeOfAssets[] | NodeAsset[],
    index: number
  ) {
    const prevItens = this.formatItems.slice(0, index + 1);
    const nextItens = this.formatItems.slice(index + 1);

    this.formatItems = [
      ...prevItens,
      ...(subNodes as NodeAsset[]),
      ...nextItens,
    ];

    this.qtdItems = this.formatItems.length;

    this.render();
  }
}
