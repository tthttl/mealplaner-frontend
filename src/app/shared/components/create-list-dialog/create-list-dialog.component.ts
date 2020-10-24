import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData, List } from '../../model/model';

@Component({
  selector: 'app-create-list-dialog',
  templateUrl: './create-list-dialog.component.html',
  styleUrls: ['./create-list-dialog.component.scss']
})
export class CreateListDialogComponent {
  public listTitle = '';

  constructor(
    public dialogRef: MatDialogRef<CreateListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData<List[]>,
  ) {
  }

  createList(): void {
    this.dialogRef.close({event: 'create', title: this.listTitle});
  }

  close(): void {
    this.dialogRef.close();
  }
}
