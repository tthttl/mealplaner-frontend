import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { TranslatePipe } from '../../../i18n/pipes/translate.pipe';
import { copyIngredientsToShoppingList, copyRecipeToMealplaner } from '../../../shared/actions/shared-actiion';
import { EditListDialogComponent } from '../../../shared/components/edit-list-dialog/edit-list-dialog.component';
import { mapSelectedIngredientToBasicShoppingListItem } from '../../../shared/helpers/helpers';
import {
  BasicShoppingListItem,
  Cookbook,
  CreateListDialogEvent,
  I18n,
  Language,
  List,
  Recipe,
  RecipeViewDialogEvent,
  SelectedIngredient
} from '../../../shared/model/model';
import { DialogService } from '../../../shared/services/dialog.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { activeShoppingListId, GlobalState, selectActiveCookbook, selectCookbooks, selectTranslations } from '../../../shared/state';
import { CookbookApiActions, CookbookContainerActions } from '../../actions';
import { RecipeViewComponent } from '../../components/recipe-view/recipe-view.component';

@Component({
  selector: 'app-cookbook-container',
  templateUrl: './cookbook-container.component.html',
  styleUrls: ['./cookbook-container.component.scss']
})
export class CookbookContainerComponent implements OnInit, OnDestroy {

  translations$: Observable<I18n | null>;
  currentLang$: Observable<Language>;
  recipes$: Observable<Recipe[]>;
  cookbooks$: Observable<Cookbook[]>;
  selectedCookbook$: Observable<Cookbook | undefined>;
  private destroy$: Subject<void> = new Subject<void>();

  private recipeViewTranslations: {} = {};
  private listDialogTranslations: {} = {};

  constructor(
    private store: Store<GlobalState>,
    private router: Router,
    private snackBarService: SnackbarService,
    private dialogService: DialogService,
    private translatePipe: TranslatePipe,
  ) {
    this.translations$ = this.store.select(selectTranslations);
    this.currentLang$ = this.store.select((state: GlobalState) => state.appState.language);
    this.recipes$ = this.selectRecipes();
    this.cookbooks$ = this.store.select(selectCookbooks);
    this.selectedCookbook$ = this.store.select((state: GlobalState) => {
      if (state.cookbookState.activeCookbookId) {
        return state.cookbookState.cookbooks.find((cookbook: Cookbook) => cookbook.id === state.cookbookState.activeCookbookId);
      } else {
        return state.cookbookState.cookbooks[0];
      }
    });
  }

  ngOnInit(): void {
    this.store.dispatch(CookbookContainerActions.loadCookbook());
    this.store.select(selectTranslations).pipe(
      withLatestFrom(this.store.select((state: GlobalState) => state.appState.language))
    ).subscribe(([translations, currentLanguage]: [I18n | null, Language]) => {
      this.recipeViewTranslations = {
        'ingredients.label-text': this.translatePipe.transform('ingredients.label-text', translations, currentLanguage),
        'button.add-to-shopping-list': this.translatePipe.transform('button.add-to-shopping-list', translations, currentLanguage),
        'button.add-to-mealplaner': this.translatePipe.transform('button.add-to-mealplaner', translations, currentLanguage),
      };
      this.listDialogTranslations = {
        title: this.translatePipe.transform('create-list.title', translations, currentLanguage),
        'save-button-text': this.translatePipe.transform('create-list.save-button-text', translations, currentLanguage),
        'cancel-button-text': this.translatePipe.transform('create-list.cancel-button-text', translations, currentLanguage),
        placeholder: this.translatePipe.transform('create-cookbook.placeholder', translations, currentLanguage),
      };
    });
  }

  onDeleteRecipe(recipe: Recipe): void {
    const snackBarRef = this.snackBarService.openSnackBar('message.undo', 'message.action');
    this.store.dispatch(CookbookContainerActions.deleteRecipeFromState({recipeToDelete: recipe}));
    snackBarRef.afterDismissed().pipe(take(1))
      .subscribe(({dismissedByAction}) => {
        if (dismissedByAction) {
          this.store.dispatch(CookbookApiActions.undoDeleteRecipeFromState({recipe}));
        } else {
          this.store.dispatch(CookbookContainerActions.deleteRecipe({recipe}));
        }
      });
  }

  onEditRecipe(recipeId: string): void {
    this.router.navigate([`cookbook/recipe/${recipeId}`]);
  }

  onCreateRecipe(): void {
    this.router.navigate(['cookbook/recipe']);
  }

  onClickRecipe(recipe: Recipe): void {
    const dialogRef = this.dialogService.openDialog(RecipeViewComponent, {
      data: recipe,
      translations: this.recipeViewTranslations,
    });
    dialogRef.afterClosed()
      .pipe(
        take(1),
        withLatestFrom(this.store.select(activeShoppingListId))
      )
      .subscribe(([event, shoppingListId]: [RecipeViewDialogEvent, string | undefined]) => {
        switch (event?.event) {
          case 'recipe':
            this.store.dispatch(copyRecipeToMealplaner({recipe: event.recipe!}));
            break;
          case 'selectedIngredients':
            event.selectedIngredients?.filter((item: SelectedIngredient) => item.isSelected)
              .map((item: SelectedIngredient) => mapSelectedIngredientToBasicShoppingListItem(item, shoppingListId))
              .map((item: BasicShoppingListItem) => {
                console.log(item);
                return item;
              })
              .forEach((item: BasicShoppingListItem) => this.store.dispatch(copyIngredientsToShoppingList({
                optimisticId: uuid(),
                shoppingListItem: item
              })));
            break;
        }
      });
  }

  onInputChanged(searchTerm: string): void {
    this.recipes$ = this.selectRecipes().pipe(
      map((recipes: Recipe[]) => {
        return recipes.filter((recipe: Recipe) => recipe.title.toLowerCase().includes(searchTerm.toLowerCase()));
      })
    );
  }

  selectRecipes(): Observable<Recipe[]> {
    return this.store.select(selectActiveCookbook).pipe(
      switchMap((activeCookbookId: string) => this.store
        .select((state: GlobalState) => state.cookbookState.recipes[activeCookbookId]))
    );
  }

  onCreateList(): void {
    const dialogRef = this.dialogService.openDialog(EditListDialogComponent, {
      data: {},
      translations: this.listDialogTranslations,
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: CreateListDialogEvent | undefined) => {
        if (result?.event === 'create') {
          this.store.dispatch(CookbookContainerActions.createCookbook({ optimisticId: uuid(), title: result.title}));
        }
      });
  }

  onSelectList(list: List): void {
    this.store.dispatch(CookbookContainerActions.selectCookbook({selectedCookbookId: list.id}));
  }

  onEditList(list: List): void {

  }

  onDeleteList(list: List): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
