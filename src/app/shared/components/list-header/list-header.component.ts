import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { List, ListPickerDialogEvent } from '../../model/model';
import { DialogService } from '../../services/dialog.service';
import { ListPickerDialogComponent } from '../list-picker-dialog/list-picker-dialog.component';

@Component({
  selector: 'app-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListHeaderComponent implements OnInit {
  @Input() selectedList: List | null | undefined = undefined;
  @Input() lists: List[] | null | undefined = undefined;
  @Input() defaultTitle = '';
  @Input() addListLabel = '';
  @Input() buttonLabel = '';
  @Output() createList: EventEmitter<undefined> = new EventEmitter();
  @Output() selectList: EventEmitter<List> = new EventEmitter();
  @Output() editList: EventEmitter<List> = new EventEmitter();
  @Output() deleteList: EventEmitter<List> = new EventEmitter();

  constructor(private dialogService: DialogService) {
  }

  ngOnInit(): void {
  }

  openList(): void {
    const dialogRef = this.dialogService.openDialog(ListPickerDialogComponent, {
      data: this.lists,
      translations: {
        'new-list': this.addListLabel,
        'default-title': this.defaultTitle,
      }
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: ListPickerDialogEvent | undefined) => {
        switch (result?.event) {
          case 'create':
            this.createList.emit();
            break;
          case 'select':
            this.selectList.emit(result?.list);
            break;
          case 'edit':
            this.editList.emit(result?.list);
            break;
          case 'delete':
            this.deleteList.emit(result?.list);
            break;
        }
      });

  }
}
