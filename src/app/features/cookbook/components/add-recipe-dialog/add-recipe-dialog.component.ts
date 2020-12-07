import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData, Recipe, RecipeIngredient } from '../../../../core/models/model';

@Component({
  selector: 'app-recipe-dialog',
  templateUrl: './add-recipe-dialog.component.html',
  styleUrls: ['./add-recipe-dialog.component.scss']
})
export class AddRecipeDialogComponent implements OnInit {
  ingredientsForm: FormGroup = new FormGroup({
    ingredients: new FormArray([])
  });
  ingredients: FormArray = new FormArray([]);

  constructor(
    public dialogRef: MatDialogRef<AddRecipeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData<Recipe>,
  ) {
  }

  ngOnInit(): void {
    this.dialogData.data.ingredients.forEach((ingredient: RecipeIngredient) => {
      ((this.ingredientsForm.controls.ingredients as FormArray).controls).push(new FormGroup({
        id: new FormControl(ingredient.id),
        isSelected: new FormControl(!ingredient.isStapleFood),
        title: new FormControl(ingredient.title),
        amount: new FormControl(ingredient.amount),
        unit: new FormControl(ingredient.unit),
        unitLabel: new FormControl(this.dialogData.translations[ingredient.unit])
      }));
    });
    this.ingredients = this.ingredientsForm.controls.ingredients as FormArray;
  }

  onAddIngredients(): void {
    this.dialogRef.close({
      event: 'selectedIngredients',
      selectedIngredients: this.ingredients.controls.map((control: AbstractControl) => (control as FormGroup).value)
    });
  }

  getFormControl(ingredient: AbstractControl, key: string): FormControl {
    return (ingredient as FormGroup).controls[key] as FormControl;
  }

  toggleSelected(ingredient: AbstractControl, isSelected: boolean): void {
    this.getFormControl(ingredient, 'isSelected').setValue(isSelected);
  }
}
