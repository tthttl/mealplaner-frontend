import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { DEFAULT_LANGUAGE } from '../../../shared/helpers/constants';
import { translateValidationErrors } from '../../../shared/helpers/helpers';
import { I18n, Language, Recipe, RecipeIngredient, SelectOption } from '../../../shared/model/model';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent implements OnInit {

  @Input() translations: I18n = {};
  @Input() currentLang: Language = DEFAULT_LANGUAGE;
  @Output() recipeSaved: EventEmitter<Recipe> = new EventEmitter<Recipe>();

  recipeForm: FormGroup;
  ingredients: FormArray;
  units: SelectOption<string>[] = [];

  constructor(private translatePipe: TranslatePipe) {
    this.recipeForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      url: new FormControl(''),
      ingredients: new FormArray([
        this.createNewEmptyIngredientFormGroup()
      ])
    });
    this.ingredients = this.recipeForm?.controls.ingredients as FormArray;
  }

  ngOnInit(): void {
    this.units = this.createUnits();
  }


  getFormControl(key: string): FormControl {
    return this.recipeForm?.controls[key] as FormControl;
  }

  getIngredientFormControl(ingredient: AbstractControl, key: string): FormControl {
    return (ingredient as FormGroup).controls[key] as FormControl;
  }

  createNewEmptyIngredientFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      amount: new FormControl(null, [Validators.required, Validators.min(1)]),
      unit: new FormControl('kg', [Validators.required]),
      isStapleFood: new FormControl(false, [Validators.required])
    });
  }

  onSubmit(): void {
    const recipe = this.recipeForm.value;
    recipe.ingredients.map((ingredient: RecipeIngredient) => ingredient.amount = +ingredient.amount);
    this.recipeSaved.emit(recipe);
  }

  addEmptyIngredientRow(): void {
    this.ingredients.push(this.createNewEmptyIngredientFormGroup());
  }

  deleteIngredient(index: number): void {
    (this.recipeForm.controls.ingredients as FormArray).removeAt(index);
  }

  getErrorsFor(key: string): string[] {
    return translateValidationErrors(
      this.getFormControl(key),
      this.translatePipe,
      this.translations,
      this.currentLang);
  }

  createUnits(): SelectOption<string>[] {
    return [
      {
        value: 'tableSpoon',
        key: this.translatePipe.transform('forms.units.tablespoon', this.translations, this.currentLang)
      },
      {
        value: 'coffeeSpoon',
        key: this.translatePipe.transform('forms.units.coffee-spoon', this.translations, this.currentLang)
      },
      {
        value: 'pinch',
        key: this.translatePipe.transform('forms.units.pinch', this.translations, this.currentLang)
      },
      {
        value: 'pack',
        key: this.translatePipe.transform('forms.units.pack', this.translations, this.currentLang)
      },
      {
        value: 'piece',
        key: this.translatePipe.transform('forms.units.piece', this.translations, this.currentLang)
      },
      {value: 'kg', key: 'kg'},
      {value: 'g', key: 'g'},
      {value: 'l', key: 'l'},
      {value: 'dl', key: 'dl'},
      {value: 'ml', key: 'ml'},
    ];
  }


}
