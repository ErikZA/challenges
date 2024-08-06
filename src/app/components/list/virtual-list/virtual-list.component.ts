import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { NodeAsset } from '@app/shared/interfaces/companies';

@Component({
  selector: 'app-virtual-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './virtual-list.component.html',
  styleUrl: './virtual-list.component.scss',
})
export class VirtualListComponent implements AfterViewInit {
  @ViewChild('virtual_list') private virtualList!: ElementRef<HTMLUListElement>;
  // @Input() public data: NodeAsset[] = [];
  qtdItems = 17_900_000;
  data = Array.from({ length: this.qtdItems }, (_, i) => i + 1);

  private lineHeight = 36;
  private limit = 15;
  private visibleHeight = this.limit * this.lineHeight;

  private scrollTop = 0;

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

  private render() {
    const { startSpacerHeight, startItemIndex, endItemIndex, endSpacerHeight } =
      this.calculateVisibleItems();

    this.resetList();

    this.createStartSpacer(startSpacerHeight);

    this.populateList(startItemIndex, endItemIndex);

    this.createEndSpacer(endSpacerHeight);
  }

  private resetList() {
    this.virtualList.nativeElement.innerHTML = '';
  }

  private createEndSpacer(endSpacerHeight: number) {
    const endSpacer = document.createElement('li');

    endSpacer.style.height = endSpacerHeight + 'px';
    this.virtualList.nativeElement.append(endSpacer);
  }

  private populateList(startItemIndex: number, endItemIndex: number) {
    const items = this.data.slice(startItemIndex, endItemIndex);

    items.forEach(item => {
      const listItem = document.createElement('li');

      listItem.innerHTML = `${item}`;
      listItem.style.height = this.lineHeight + 'px';
      listItem.classList.add('list__item');
      this.virtualList.nativeElement.append(listItem);
    });
  }

  private createStartSpacer(startSpacerHeight: number) {
    const startSpacer = document.createElement('li');

    startSpacer.style.height = `${startSpacerHeight}px`;
    this.virtualList.nativeElement.append(startSpacer);
  }

  private calculateVisibleItems() {
    const fullListHeight = this.data.length * this.lineHeight;
    const startItemIndex = Math.ceil(this.scrollTop / this.lineHeight);
    const endItemIndex = startItemIndex + this.limit;
    const startSpacerHeight = this.scrollTop;
    const endSpacerHeight =
      fullListHeight - startSpacerHeight - this.visibleHeight;

    return { startSpacerHeight, startItemIndex, endItemIndex, endSpacerHeight };
  }
}
