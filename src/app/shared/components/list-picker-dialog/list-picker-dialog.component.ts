import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData, List } from '../../model/model';

@Component({
  selector: 'app-list-picker-dialog',
  templateUrl: './list-picker-dialog.component.html',
  styleUrls: ['./list-picker-dialog.component.scss']
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

  selectList(listId: string): void {
    this.dialogRef.close({event: 'select', listId});
  }

  editList(listId: string): void {
    this.dialogRef.close({event: 'edit', listId});
  }

  deleteList(listId: string): void {
    this.dialogRef.close({event: 'delete', listId});
  }
}
