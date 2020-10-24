import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { List, ListPickerDialogEvent } from '../../model/model';
import { DialogService } from '../../services/dialog.service';
import { take } from 'rxjs/operators';
import { ListPickerDialogComponent } from '../list-picker-dialog/list-picker-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.scss']
})
export class ListHeaderComponent implements OnInit {
  @Input() selectedList: List | null | undefined = undefined;
  @Input() lists: List[] | null | undefined = undefined;
  @Input() defaultTitle = '';
  @Input() addListLabel = '';
  @Input() buttonLabel = '';
  @Output() createList: EventEmitter<undefined> = new EventEmitter();
  @Output() selectList: EventEmitter<string> = new EventEmitter();
  @Output() editList: EventEmitter<string> = new EventEmitter();
  @Output() deleteList: EventEmitter<string> = new EventEmitter();

  constructor(private dialogService: DialogService, public dialog: MatDialog) {
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
      .subscribe((result: ListPickerDialogEvent) => {
        switch (result?.event) {
          case 'create':
            this.createList.emit();
            break;
          case 'select':
            this.selectList.emit(result.listId);
            break;
          case 'edit':
            this.editList.emit(result.listId);
            break;
          case 'delete':
            this.deleteList.emit(result.listId);
            break;
        }
      });

  }
}

