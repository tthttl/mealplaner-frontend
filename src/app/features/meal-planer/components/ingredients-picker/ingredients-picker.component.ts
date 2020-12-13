import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BasicShoppingListItem, I18n, Language, RecipeIngredient, SelectedIngredient, ShoppingList } from '../../../../core/models/model';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { mapSelectedIngredientToBasicShoppingListItem } from '../../../../core/helpers/helpers';

@Component({
  selector: 'app-ingredients-picker',
  templateUrl: './ingredients-picker.component.html',
  styleUrls: ['./ingredients-picker.component.scss']
})
export class IngredientsPickerComponent implements OnInit {
  @Input() translations: I18n | null = null;
  @Input() currentLanguage: Language | null = null;
  @Input() preSelectedShoppingListId: string | null | undefined = undefined;
  @Input() shoppingLists: ShoppingList[] | undefined | null = null;
  @Input() ingredientsList: RecipeIngredient[] | undefined = undefined;
  @Output() choseIngredients: EventEmitter<BasicShoppingListItem[]> = new EventEmitter();
  @Output() back: EventEmitter<undefined> = new EventEmitter();

  selectedShoppingListId: string | null | undefined = undefined;

  ingredientsForm: FormGroup = new FormGroup({
    ingredients: new FormArray([])
  });

  get ingredientsControls(): AbstractControl[] {
    return (this.ingredientsForm.controls.ingredients as FormArray).controls;
  }

  constructor() {
  }

  ngOnInit(): void {
    this.selectedShoppingListId = this.preSelectedShoppingListId;

    this.ingredientsList?.forEach((ingredient: RecipeIngredient) => {
      ((this.ingredientsForm.controls.ingredients as FormArray).controls).push(new FormGroup({
        id: new FormControl(ingredient.id),
        isSelected: new FormControl(!ingredient.isStapleFood),
        title: new FormControl(ingredient.title),
        amount: new FormControl(ingredient.amount),
        unit: new FormControl(ingredient.unit),
        unitLabel: new FormControl('unit.' + ingredient.unit)
      }));
    });
  }

  getFormControl(ingredient: AbstractControl, key: string): FormControl {
    return (ingredient as FormGroup)?.controls ? (ingredient as FormGroup)?.controls[key] as FormControl : {} as FormControl;
  }

  toggleSelected(ingredient: AbstractControl, isSelected: boolean): void {
    this.getFormControl(ingredient, 'isSelected').setValue(isSelected);
  }

  onChooseIngredients(): void {
    const ingredients = this.ingredientsControls
      .map((control: AbstractControl) => (control as FormGroup).value)
      .filter((item: SelectedIngredient) => item.isSelected)
      .map((item: SelectedIngredient) => mapSelectedIngredientToBasicShoppingListItem(item, this.selectedShoppingListId || undefined));

    this.choseIngredients.emit(ingredients);
  }

  onChangeSelectedShoppingList(selectedShoppingListId: string): void {
    this.selectedShoppingListId = selectedShoppingListId;
  }

  goBack(): void {
    this.back.emit();
  }
}
