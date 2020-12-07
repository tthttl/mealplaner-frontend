import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cookbook, DialogData, I18n, Language, MealPlanerAddEvent, MealType, Recipe, ShoppingList } from '../../../../core/models/model';
import { Store } from '@ngrx/store';
import {
  activeShoppingListId,
  GlobalState,
  selectActiveCookbookId,
  selectCookbooks,
  selectRecipes,
  selectShoppingLists,
  selectTranslations
} from '../../../../core/store';
import { LoadMealDialogActions } from '../../store/actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-meal-dialog',
  templateUrl: './add-meal-dialog.component.html',
  styleUrls: ['./add-meal-dialog.component.scss']
})
export class AddMealDialogComponent implements OnInit {
  public isEditing = false;
  recipes$: Observable<{ [key: string]: Recipe[] } | undefined> = this.store.select(selectRecipes);
  preSelectedCookbookId$: Observable<string> = this.store.select(selectActiveCookbookId);
  preSelectedShoppingListId$: Observable<string | undefined> = this.store.select(activeShoppingListId);
  shoppingLists$: Observable<ShoppingList[] | undefined> = this.store.select(selectShoppingLists);
  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language | null> = this.store.select((state: GlobalState) => state.appState.language);
  cookBooks$: Observable<Cookbook[] | null> = this.store.select(selectCookbooks);


  constructor(
    public dialogRef: MatDialogRef<AddMealDialogComponent>,
    private store: Store<GlobalState>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData<{ mealType: MealType }>,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(LoadMealDialogActions.loadShoppingLists());
    this.store.dispatch(LoadMealDialogActions.loadCookbooks());
  }

  addRecipe({recipe, shoppingListItems}: MealPlanerAddEvent): void {
    this.dialogRef.close({
      event: 'addMeal',
      mealType: this.dialogData.data.mealType,
      recipe,
      shoppingListItems
    });
  }

  onSelectedCookbookChanged(id: string): void {
    this.store.dispatch(LoadMealDialogActions.loadRecipesForSelectedCookbook({id}));
  }
}
