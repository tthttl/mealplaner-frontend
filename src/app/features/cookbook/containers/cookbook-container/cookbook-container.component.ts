import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { mapSelectedIngredientToBasicShoppingListItem } from '../../../../core/helpers/helpers';
import {
  BasicShoppingListItem,
  Cookbook,
  CreateListDialogEvent,
  EditListDialogEvent,
  I18n,
  Language,
  List,
  Recipe,
  RecipeViewDialogEvent,
  SelectedIngredient,
  ShoppingList
} from '../../../../core/models/model';
import { DialogService } from '../../../../core/services/dialog.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import {
  activeShoppingList,
  activeShoppingListId,
  GlobalState,
  selectActiveCookbookId,
  selectCookbooks,
  selectedCookbook,
  selectTranslations
} from '../../../../core/store';


import { EditListDialogComponent } from '../../../../shared/components/edit-list-dialog/edit-list-dialog.component';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { AddRecipeDialogComponent } from '../../components/add-recipe-dialog/add-recipe-dialog.component';
import { CookbookApiActions, CookbookContainerActions } from '../../store/actions';
import { copyIngredientsToShoppingList, copyRecipeToMealplaner } from '../../store/actions/cookbook-container.actions';

@Component({
  selector: 'app-cookbook-container',
  templateUrl: './cookbook-container.component.html',
  styleUrls: ['./cookbook-container.component.scss']
})
export class CookbookContainerComponent implements OnInit, OnDestroy {
  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language> = this.store.select((state: GlobalState) => state.appState.language);
  recipes$: Observable<Recipe[]> = this.selectRecipes();
  cookbooks$: Observable<Cookbook[]> = this.store.select(selectCookbooks);
  selectedCookbook$: Observable<Cookbook | undefined>;
  activeShoppingList$: Observable<ShoppingList | undefined> = this.store.select(activeShoppingList);
  private destroy$: Subject<void> = new Subject<void>();

  private addRecipeDialogTranslations: {} = {};
  private createListDialogTranslations: {} = {};
  private editListDialogTranslations: {} = {};

  constructor(
    private store: Store<GlobalState>,
    private router: Router,
    private snackBarService: SnackbarService,
    private dialogService: DialogService,
    private translatePipe: TranslatePipe,
  ) {
    this.selectedCookbook$ = this.store.select(selectedCookbook);
  }

  ngOnInit(): void {
    this.store.dispatch(CookbookContainerActions.loadCookbook());
    this.activeShoppingList$.pipe(take(1)).subscribe((shoppingList: ShoppingList | undefined) => {
      if (!shoppingList) {
        this.store.dispatch(CookbookContainerActions.loadShoppingLists());
      }
    });
    this.store.select(selectTranslations).pipe(
      withLatestFrom(this.store.select((state: GlobalState) => state.appState.language))
    ).subscribe(([translations, currentLanguage]: [I18n | null, Language]) => {
      this.addRecipeDialogTranslations = {
        'ingredients.label-text': this.translatePipe.transform('ingredients.label-text', translations, currentLanguage),
        'button.add-to-shopping-list': this.translatePipe.transform('button.add-to-shopping-list', translations, currentLanguage),
        'button.add-to-mealplaner': this.translatePipe.transform('button.add-to-mealplaner', translations, currentLanguage),
        kg: 'kg',
        g: 'g',
        l: 'l',
        dl: 'dl',
        ml: 'ml',
        tableSpoon: this.translatePipe.transform('unit.table-spoon', translations, currentLanguage),
        coffeeSpoon: this.translatePipe.transform('unit.coffee-spoon', translations, currentLanguage),
        pinch: this.translatePipe.transform('unit.pinch', translations, currentLanguage),
        piece: this.translatePipe.transform('unit.piece', translations, currentLanguage),
        pack: this.translatePipe.transform('unit.pack', translations, currentLanguage),
      };
      this.createListDialogTranslations = {
        title: this.translatePipe.transform('create-cookbook.heading', translations, currentLanguage),
        'save-button-text': this.translatePipe.transform('create-cookbook.save-button-text', translations, currentLanguage),
        'cancel-button-text': this.translatePipe.transform('create-cookbook.cancel-button-text', translations, currentLanguage),
        placeholder: this.translatePipe.transform('create-cookbook.placeholder', translations, currentLanguage),
      };
      this.editListDialogTranslations = {
        title: this.translatePipe.transform('edit-cookbook.heading', translations, currentLanguage),
        'save-button-text': this.translatePipe.transform('edit-cookbook.save-button-text', translations, currentLanguage),
        'cancel-button-text': this.translatePipe.transform('edit-cookbook.cancel-button-text', translations, currentLanguage),
        placeholder: this.translatePipe.transform('edit-cookbook.placeholder', translations, currentLanguage),
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
    const dialogRef = this.dialogService.openDialog(AddRecipeDialogComponent, {
      data: recipe,
      translations: this.addRecipeDialogTranslations,
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
                return item;
              })
              .forEach((item: BasicShoppingListItem) => this.store.dispatch(copyIngredientsToShoppingList({
                optimisticId: uuid(),
                shoppingListItem: item
              })));
            this.activeShoppingList$.pipe(take(1)).subscribe((shoppingList: ShoppingList | undefined) => {
              const snackBarRef = this.snackBarService.openSnackBar('message.ingredients-added-to-shoppinglist', shoppingList?.title || '');
              snackBarRef.afterDismissed().pipe(take(1)).subscribe(({dismissedByAction}) => {
                if (dismissedByAction) {
                  this.router.navigate(['/shopping-list'], {queryParams: {shoppingListId: shoppingList?.id}});
                }
              });
            });
            break;
        }
      });
  }

  onSearchStringChanged(searchTerm: string): void {
    this.recipes$ = this.selectRecipes().pipe(
      map((recipes: Recipe[]) => {
        return recipes.filter((recipe: Recipe) => recipe.title.toLowerCase().includes(searchTerm.toLowerCase()));
      })
    );
  }

  selectRecipes(): Observable<Recipe[]> {
    return this.store.select(selectActiveCookbookId).pipe(
      switchMap((activeCookbookId: string) => this.store
        .select((state: GlobalState) => state.cookbookState.recipes[activeCookbookId]))
    );
  }

  onCreateCookbook(): void {
    const dialogRef = this.dialogService.openDialog(EditListDialogComponent, {
      data: {},
      translations: this.createListDialogTranslations,
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: CreateListDialogEvent | undefined) => {
        if (result?.event === 'create') {
          this.store.dispatch(CookbookContainerActions.createCookbook({optimisticId: uuid(), title: result.title}));
        }
      });
  }

  onSelectCookbook(list: List): void {
        this.store.dispatch(CookbookContainerActions.selectCookbook({selectedCookbookId: list.id}));
  }

  onEditCookbook(list: List): void {
    const dialogRef = this.dialogService.openDialog(EditListDialogComponent, {
      data: list,
      translations: this.editListDialogTranslations,
    });
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: EditListDialogEvent | undefined) => {
        if (result?.event === 'edit') {
          this.store.dispatch(CookbookContainerActions.editCookbook({cookbook: result.list}));
        }
      });
  }

  onDeleteCookbook(list: List): void {
    const snackBarRef = this.snackBarService.openSnackBar('message.undo', 'message.action');
    this.store.dispatch(CookbookContainerActions.deleteCookbookFromState({cookbook: list}));
    snackBarRef.afterDismissed().pipe(take(1))
      .subscribe(({dismissedByAction}) => {
        if (dismissedByAction) {
          this.store.dispatch(CookbookApiActions.undoDeleteCookbookFromState({cookbook: list}));
        } else {
          this.store.dispatch(CookbookContainerActions.deleteCookbook({cookbook: list}));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
