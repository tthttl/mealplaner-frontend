import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData, List } from '../../model/model';

@Component({
  selector: 'app-edit-list-dialog',
  templateUrl: './edit-list-dialog.component.html',
  styleUrls: ['./edit-list-dialog.component.scss']
})
export class EditListDialogComponent {
  public isEditing = false;
  public listForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData<List>,
  ) {
    if (dialogData.data.id) {
      this.isEditing = true;
    }

    this.listForm = new FormGroup({
      title: new FormControl(this.isEditing ? dialogData.data.title : '', [Validators.required])
    });
  }

  createList(): void {
    this.isEditing ?
      this.dialogRef.close({
        event: 'edit',
        list: {...this.dialogData.data, ...this.listForm.value}
      }) : this.dialogRef.close({event: 'create', title: this.listForm.value.title});
  }

  getFormControl(key: string): FormControl {
    return this.listForm?.controls[key] as FormControl;
  }

  close(): void {
    this.dialogRef.close();
  }
}
