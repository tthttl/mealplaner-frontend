import { LocationStrategy } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DEFAULT_LANGUAGE } from '../../../../core/constants/constants';
import { isFormTouchedOrDirty, translateValidationErrors } from '../../../../core/helpers/helpers';
import { I18n, Language, Recipe, RecipeIngredient, SelectOption, Unit } from '../../../../core/models/model';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipePageComponent implements OnInit, OnDestroy {

  @Input() translations: I18n | null = {};
  @Input() currentLanguage: Language | null = DEFAULT_LANGUAGE;
  @Input() recipe$: Observable<Recipe | undefined> | undefined;
  @Input() isEmptyForm = false;
  @Output() recipeSaved: EventEmitter<Recipe> = new EventEmitter<Recipe>();

  recipeForm: FormGroup;
  ingredients: FormArray;
  units: SelectOption<string>[] = [];
  destroy$: Subject<void> = new Subject<void>();

  constructor(
    private translatePipe: TranslatePipe,
    private location: LocationStrategy,
  ) {
    this.recipeForm = new FormGroup({
      id: new FormControl(''),
      cookbookId: new FormControl(''),
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
    this.recipe$?.pipe(takeUntil(this.destroy$)).subscribe((recipe: Recipe | undefined) => this.fillForm(recipe));
  }

  fillForm(recipe: Recipe | undefined): void {
    if (!!recipe) {
      Object.keys(recipe).forEach((key: string) => {
        if (key === 'ingredients') {
          (this.recipeForm.controls.ingredients as FormArray).controls = [];
          recipe?.ingredients.forEach((ingredient: RecipeIngredient, index: number) => {
            (this.recipeForm.controls.ingredients as FormArray)
              .push(this.createNewIngredientFormGroup(
                ingredient.id,
                ingredient.title,
                ingredient.amount,
                ingredient.unit,
                ingredient.isStapleFood)
              );
          });
        } else {
          // @ts-ignore
          this.getFormControl(key).setValue(recipe[key]);
        }
      });
    }
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
    this.destroy$.next();
    if (!isFormTouchedOrDirty(this.recipeForm)) {
      this.location.back();
      return;
    }
    const recipeToSave: Recipe = this.recipeForm?.value;
    if (!recipeToSave.id) {
      delete recipeToSave.id;
      recipeToSave.title = recipeToSave.title.substring(0, 1).toUpperCase() + recipeToSave.title.substring(1);
    }
    recipeToSave.ingredients.map((ingredient: RecipeIngredient) => {
      if (!ingredient.id) {
        delete ingredient.id;
      }
      ingredient.amount = +ingredient.amount;
    });
    this.recipeSaved.emit(recipeToSave);
  }

  getButtonText(): string {
    if (isFormTouchedOrDirty(this.recipeForm)) {
      return this.getFormControl('id').value ? 'button.modify' : 'button.submit';
    }
    return 'button.back';
  }

  addEmptyIngredientRow(): void {
    this.ingredients.push(this.createNewIngredientFormGroup());
  }

  deleteIngredient(index: number): void {
    (this.recipeForm?.controls.ingredients as FormArray).removeAt(index);
    this.recipeForm.markAllAsTouched();
  }

  getErrorsFor(key: string): string[] {
    return translateValidationErrors(
      this.getFormControl(key),
      this.translatePipe,
      this.translations,
      this.currentLanguage);
  }

  createUnits(): SelectOption<string>[] {
    return [
      {
        value: 'tableSpoon',
        key: this.translatePipe.transform('unit.table-spoon', this.translations, this.currentLanguage)
      },
      {
        value: 'coffeeSpoon',
        key: this.translatePipe.transform('unit.coffee-spoon', this.translations, this.currentLanguage)
      },
      {
        value: 'pinch',
        key: this.translatePipe.transform('unit.pinch', this.translations, this.currentLanguage)
      },
      {
        value: 'pack',
        key: this.translatePipe.transform('unit.pack', this.translations, this.currentLanguage)
      },
      {
        value: 'piece',
        key: this.translatePipe.transform('unit.piece', this.translations, this.currentLanguage)
      },
      {value: 'kg', key: 'kg'},
      {value: 'g', key: 'g'},
      {value: 'l', key: 'l'},
      {value: 'dl', key: 'dl'},
      {value: 'ml', key: 'ml'},
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
