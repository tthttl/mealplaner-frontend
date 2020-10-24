import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData, Recipe, RecipeIngredient, SelectedIngredient } from '../../../shared/model/model';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss']
})
export class RecipeViewComponent implements OnInit {

  @Output() selectedIngredients: EventEmitter<SelectedIngredient[]> = new EventEmitter<SelectedIngredient[]>();
  ingredientsForm: FormGroup = new FormGroup({
    ingredients: new FormArray([])
  });
  ingredients: FormArray = new FormArray([]);

  constructor(
    public dialogRef: MatDialogRef<RecipeViewComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData<Recipe>,
  ) {
  }

  ngOnInit(): void {
    this.dialogData.data.ingredients.forEach((ingredient: RecipeIngredient) => {
      ((this.ingredientsForm.controls.ingredients as FormArray).controls).push(new FormGroup({
        id: new FormControl(ingredient.id),
        isSelected: new FormControl(ingredient.isStapleFood),
        title: new FormControl(ingredient.title),
        amount: new FormControl(ingredient.amount),
        unit: new FormControl(ingredient.unit)
      }));
    });
    this.ingredients = this.ingredientsForm.controls.ingredients as FormArray;
  }

  onEdit(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    console.log(this.ingredientsForm.value.ingredients);
    this.selectedIngredients.emit(this.ingredientsForm.value.ingredients);
  }

  getFormControl(ingredient: AbstractControl, key: string): FormControl {
    return (ingredient as FormGroup).controls[key] as FormControl;
  }

  toggleSelected(ingredient: AbstractControl, isSelected: boolean): void {
    this.getFormControl(ingredient, 'isSelected').setValue(isSelected);
  }

}
