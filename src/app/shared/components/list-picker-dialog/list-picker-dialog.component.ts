import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData, List } from '../../../core/models/model';

@Component({
  selector: 'app-list-picker-dialog',
  templateUrl: './list-picker-dialog.component.html',
  styleUrls: ['./list-picker-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPickerDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ListPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData<List[]>,
  ) {
  }

  createList(): void {
    this.dialogRef.close({event: 'create'});
  }

  selectList(list: List): void {
    this.dialogRef.close({event: 'select', list});
  }

  editList(list: List): void {
    this.dialogRef.close({event: 'edit', list});
  }

  deleteList(list: List): void {
    this.dialogRef.close({event: 'delete', list});
  }
}
