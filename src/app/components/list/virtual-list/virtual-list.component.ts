import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { AbstractListComponent } from '@app/components/list/abstract-list';
import { NodeAsset, TreeOfAssets } from '@app/shared/interfaces/companies';
import { ActiveFilter } from '@app/shared/interfaces/core/menu.interface';
import { CompaniesService } from '@app/shared/services/companies';

import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-virtual-list',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './virtual-list.component.html',
  styleUrl: './virtual-list.component.scss',
})
export class VirtualListComponent extends AbstractListComponent {
  @Input({ required: true }) public set searchWord(word: string) {
    this._searchWord = word;
    this.selectedIds.clear();
    this.updateSearchResults(word);
  }

  @Input() public set activeFilter(active: ActiveFilter | null) {
    setTimeout(() => {
      this._activeFilter = active;
      this.selectedIds.clear();
      this.updateSearchResults(this._searchWord);
    }, 200);
  }

  @Input({ required: true }) public set items(
    nodes: TreeOfAssets | NodeAsset | null
  ) {
    this.selectedIds.clear();
    this._items = nodes;
    this.resetItens(nodes);
    this.updateSearchResults(this._searchWord);
  }

  private companiesService = inject(CompaniesService);

  constructor() {
    super();
  }

  protected updateSearchResults(word: string) {
    if (
      (!word || word.length < 3) &&
      this.qtdOriginalItems !== this.formatItems.length
    ) {
      this.resetItens(this._items);
    } else if (!!word && word.length >= 3) {
      this.companiesService.isLoading$.next(true);
      setTimeout(() => {
        this.filterNodesBySearchWord().finally(() =>
          this.companiesService.isLoading$.next(false)
        );
      }, 0);
    }
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

  private async filterNodesBySearchWord(nodesArray = this.originalFormatItems) {
    this.formatItems = await this.recursiveFilterNodesBySearchWord(nodesArray);

    this.qtdItems = this.formatItems.length;

    this.render();
  }

  private async recursiveFilterNodesBySearchWord(
    nodesArray: NodeAsset[]
  ): Promise<NodeAsset[]> {
    return nodesArray.reduce<Promise<NodeAsset[]>>(async (accPromise, node) => {
      const acc = await accPromise;
      const subNodes = this.subNodes(node);

      if (subNodes.length) {
        const filteredSubNodes = await this.recursiveFilterNodesBySearchWord(
          subNodes as unknown as NodeAsset[]
        );

        if (filteredSubNodes.length) {
          return [
            ...acc,
            { ...node, children: filteredSubNodes as unknown as TreeOfAssets },
          ];
        } else if (this.searchWordInNode(node)) {
          return [...acc, node];
        }
      } else if (this.searchWordInNode(node)) {
        return [...acc, node];
      }

      return acc;
    }, Promise.resolve([] as NodeAsset[]));
  }

  private searchWordInNode(node: NodeAsset) {
    return (
      node?.name?.toLowerCase().includes(this._searchWord.toLowerCase()) ||
      (!!node.sensorId &&
        node.sensorId.toLowerCase().includes(this._searchWord.toLowerCase()))
    );
  }

  public calcSpace(node: NodeAsset | null) {
    const space = 58;

    if (!node) return '0px';
    else if (node.space && node.space > 0 && node.space === 1)
      return `${space}px`;
    else if (node.space && node.space > 0 && node.space === 2)
      return `${space + 18}px`;
    else if (node.space && node.space > 0 && node.space > 2)
      return `${(node.space + 1) * 0.5 * 48}px`;
    else return '0px';
  }
}
