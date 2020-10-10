import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { DEFAULT_LANGUAGE } from '../../../shared/helpers/constants';
import { translateValidationErrors } from '../../../shared/helpers/helpers';
import { I18n, Language, Recipe, RecipeIngredient, SelectOption, Unit } from '../../../shared/model/model';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent implements OnInit {

  @Input() translations: I18n | null = {};
  @Input() currentLang: Language | null = DEFAULT_LANGUAGE;
  @Input() recipe: Recipe | null | undefined;
  @Output() recipeSaved: EventEmitter<Recipe> = new EventEmitter<Recipe>();

  recipeForm: FormGroup;
  ingredients: FormArray;
  units: SelectOption<string>[] = [];

  constructor(private translatePipe: TranslatePipe) {
    this.recipeForm = new FormGroup({
      id: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      url: new FormControl(''),
      ingredients: new FormArray([
        this.createNewIngredientFormGroup()
      ])
    });
    this.ingredients = this.recipeForm?.controls.ingredients as FormArray;
  }

  ngOnInit(): void {
    this.units = this.createUnits();
    this.fillForm();
  }

  fillForm(): void {
    if (!!this.recipe) {
      Object.keys(this.recipe).forEach((key: string) => {
          if (key === 'ingredients') {
            this.recipe?.ingredients.forEach((ingredient: RecipeIngredient, index: number) => {
              if (index === 0) {
                this.overwriteFirstIngredient(ingredient);
              } else {
                (this.recipeForm.controls.ingredients as FormArray)
                  .push(this.createNewIngredientFormGroup(
                    ingredient.id,
                    ingredient.title,
                    ingredient.amount,
                    ingredient.unit,
                    ingredient.isStapleFood)
                  );
              }
            });
          } else {
            // @ts-ignore
            this.getFormControl(key).setValue(this.recipe[key]);
          }
        });
    }
  }

  overwriteFirstIngredient(ingredient: RecipeIngredient): void {
    Object.keys(ingredient).forEach((key: string) => {
        ((this.recipeForm.controls.ingredients as FormArray).at(0) as FormGroup).controls[key]
          // @ts-ignore
          .setValue(ingredient[key]);
      });
  }

  getFormControl(key: string): FormControl {
    return this.recipeForm?.controls[key] as FormControl;
  }

  getIngredientFormControl(ingredient: AbstractControl, key: string): FormControl {
    return (ingredient as FormGroup).controls[key] as FormControl;
  }

  createNewIngredientFormGroup(id?: string, title?: string, amount?: number, unit?: Unit, isStapleFood?: boolean): FormGroup {
    return new FormGroup({
      id: new FormControl(id || ''),
      title: new FormControl(title || '', [Validators.required]),
      amount: new FormControl(amount || null, [Validators.required, Validators.min(1)]),
      unit: new FormControl(unit || 'kg', [Validators.required]),
      isStapleFood: new FormControl(isStapleFood || false, [Validators.required])
    });
  }

  onSubmit(): void {
    const recipeToSave = this.recipeForm?.value;
    recipeToSave.ingredients.map((ingredient: RecipeIngredient) => {
      if (!ingredient.id) {
        delete ingredient.id;
      }
      ingredient.amount = +ingredient.amount;
    });
    this.recipeSaved.emit(recipeToSave);
  }

  addEmptyIngredientRow(): void {
    this.ingredients.push(this.createNewIngredientFormGroup());
  }

  deleteIngredient(index: number): void {
    (this.recipeForm?.controls.ingredients as FormArray).removeAt(index);
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
