import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData, Recipe } from '../../../shared/model/model';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss']
})
export class RecipeViewComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RecipeViewComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData<Recipe>,
  ) {
  }

  ngOnInit(): void {
  }

  onEdit(): void {
    this.dialogRef.close();
  }

}
