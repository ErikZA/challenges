import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EmbeddedViewRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NodeAsset, TreeOfAssets } from '@app/shared/interfaces/companies';

export interface Context {
  $implicit: { node: NodeAsset | null; index: number | null };
}

@Component({
  standalone: true,
  imports: [CommonModule],
  template: ``,
})
export class AbstractListComponent
  implements AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild('templateHtml', { static: true, read: TemplateRef })
  public templateHtml!: TemplateRef<Context>;
  @ViewChild('virtual_list')
  protected virtualList!: ElementRef<HTMLUListElement>;

  @ViewChild('vcr', { static: true, read: ViewContainerRef })
  public vcr!: ViewContainerRef;

  @Input({ required: true }) public items: TreeOfAssets | NodeAsset | null =
    null;

  public async ngOnChanges(changes: SimpleChanges) {
    const nodes = changes['items'].currentValue as
      | TreeOfAssets
      | NodeAsset
      | null;

    this.itemsAsNodeAsset(nodes).then(items => {
      this.formatItems = items;
      this.qtdItems = this.formatItems.length;
      this.render();
    });
  }

  protected itemsAsNodeAsset(
    nodes: TreeOfAssets | NodeAsset | null
  ): Promise<NodeAsset[]> {
    return new Promise(resolve => {
      if (nodes && nodes.id) {
        resolve([nodes] as NodeAsset[]);
      } else if (nodes) {
        resolve(Object.values(nodes) as NodeAsset[]);
      } else {
        resolve([] as NodeAsset[]);
      }
    });
  }

  public formatItems: NodeAsset[] = [];

  public qtdItems = 0;

  private embeddedViewRefs: EmbeddedViewRef<Context>[] = [];
  private cdr = inject(ChangeDetectorRef);
  private lineHeight = 36;
  private limit = 15;
  protected visibleHeight = this.limit * this.lineHeight;

  private scrollTop = 0;

  public ngOnDestroy() {
    for (const viewRef of this.embeddedViewRefs) {
      if (viewRef) {
        viewRef.destroy();
      }
    }
  }

  public ngAfterViewInit(): void {
    if (this.virtualList?.nativeElement) {
      this.virtualList.nativeElement.style.height =
        this.lineHeight * this.limit + 'px';
      this.virtualList.nativeElement.addEventListener('scroll', e => {
        this.scrollTop = (e!.currentTarget as any).scrollTop;
        this.render();
      });
      this.render();
    }
  }

  protected render() {
    const { startSpacerHeight, startItemIndex, endItemIndex, endSpacerHeight } =
      this.calculateVisibleItems();

    this.resetList();

    this.createSpace(startSpacerHeight);

    this.populateList(startItemIndex, endItemIndex);

    this.createSpace(endSpacerHeight);

    this.cdr.detectChanges();
  }

  private resetList() {
    this.vcr.clear();
  }

  private createSpace(spacerHeight: number) {
    const spacer = this.vcr.createEmbeddedView(this.templateHtml, {
      $implicit: { node: null, index: null },
    });

    spacer.rootNodes[0].style.height = spacerHeight + 'px';
    this.embeddedViewRefs.push(spacer);
  }

  private populateList(startItemIndex: number, endItemIndex: number) {
    const items = this.formatItems?.slice(startItemIndex, endItemIndex) || [];

    items.forEach(node => {
      const listItem = this.vcr.createEmbeddedView(this.templateHtml, {
        $implicit: {
          node,
          index: node.id ? this.formatItems.indexOf(node) : null,
        },
      });

      listItem.rootNodes[0].style.height = this.lineHeight + 'px';
      listItem.rootNodes[0].classList.add('list__item');
      this.embeddedViewRefs.push(listItem);
    });
  }

  private calculateVisibleItems() {
    const fullListHeight = this.qtdItems * this.lineHeight;
    const startItemIndex = Math.ceil(this.scrollTop / this.lineHeight);
    const endItemIndex = startItemIndex + this.limit;
    const startSpacerHeight = this.scrollTop;
    const endSpacerHeight =
      fullListHeight - startSpacerHeight - this.visibleHeight;

    return { startSpacerHeight, startItemIndex, endItemIndex, endSpacerHeight };
  }
}
