import { ComponentType } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private dialog: MatDialog,
  ) {
  }

  openDialog<T, D extends object>(component: ComponentType<T>, data: D): MatDialogRef<T> {
    return this.dialog.open(component, {
      data
    });
  }

}
