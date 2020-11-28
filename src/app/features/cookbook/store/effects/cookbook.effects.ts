import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { STORAGE_SELECTED_COOKBOOK_ID } from '../../../../core/constants/constants';
import { Cookbook, Recipe } from '../../../../core/models/model';
import { StorageService } from '../../../../core/services/storage.service';
import { GlobalState } from '../../../../core/store';
import { CookbookService } from '../../services/cookbook.service';
import { RecipeService } from '../../services/recipe.service';
import { CookbookApiActions, CookbookContainerActions, RecipeApiActions, RecipeContainerActions } from '../actions';

@Injectable()
export class CookbookEffects {
  constructor(
    private actions$: Actions,
    private cookbookService: CookbookService,
    private store: Store<GlobalState>,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService
  ) {
  }

  @Effect()
  loadCookbooks$ = this.actions$.pipe(
    ofType(CookbookContainerActions.loadCookbook),
    withLatestFrom(this.store),
    exhaustMap(([_, store]) => this.cookbookService.loadCookbooks(store.appState.user?.id!).pipe(
      map((cookbooks: Cookbook[]) => CookbookApiActions.loadCookbookSuccess({cookbooks})),
      catchError(() => of(CookbookApiActions.loadCookbookFailure()))
    ))
  );

  @Effect()
  loadRecipes$ = this.actions$.pipe(
    ofType(CookbookContainerActions.loadRecipes, CookbookApiActions.loadCookbookSuccess, CookbookContainerActions.selectCookbook),
    withLatestFrom(this.store.select(((state: GlobalState) => state.cookbookState.activeCookbookId))),
    map(([_, activeCookbookId]) => activeCookbookId ? activeCookbookId : this.storageService.getItem(STORAGE_SELECTED_COOKBOOK_ID)),
    concatMap((activeCookbookId: string) => this.recipeService.loadRecipes(activeCookbookId)
      .pipe(
        map((recipes: Recipe[]) => CookbookApiActions.loadRecipesSuccess({cookbookId: activeCookbookId, recipes})),
        catchError(() => of(CookbookApiActions.loadRecipesFailure()))
      )
    )
  );

  @Effect()
  saveRecipe$ = this.actions$.pipe(
    ofType(RecipeContainerActions.createRecipe),
    withLatestFrom(this.store.select(((state: GlobalState) => state.cookbookState.activeCookbookId))),
    concatMap(([action, activeCookbookId]) => this.recipeService.saveRecipe(activeCookbookId, action.recipeToSave)
      .pipe(
        map((recipe: Recipe) => RecipeApiActions.createRecipeSuccess({optimisticId: action.optimisticId, recipe})),
        catchError(() => of(RecipeApiActions.createRecipeFailure({optimisticId: action.optimisticId, cookbookId: activeCookbookId})))
      )
    )
  );

  @Effect()
  loadRecipe$ = this.actions$.pipe(
    ofType(RecipeContainerActions.loadRecipe),
    concatMap(({id}: { id: string }) => this.recipeService.loadRecipe(id).pipe(
      map((recipe: Recipe) => RecipeApiActions.loadRecipeSuccess({recipe})),
      catchError(() => of(RecipeApiActions.loadRecipeFailure()))
    ))
  );


  @Effect({dispatch: false})
  navigateToCookbook$ = this.actions$.pipe(
    ofType(RecipeApiActions.createRecipeSuccess, RecipeApiActions.editRecipeSuccess),
    tap(({recipe}) => this.router.navigate(['/cookbook'], {queryParams: {selectedCookbookId: recipe.cookbookId}}))
  );

  @Effect()
  editRecipe$ = this.actions$.pipe(
    ofType(RecipeContainerActions.editRecipe),
    withLatestFrom(this.store.select(((state: GlobalState) => state.cookbookState.activeCookbookId))),
    concatMap(([action, cookbookId]) => this.recipeService.editRecipe(cookbookId, action.recipeToEdit)
      .pipe(
        map((recipe: Recipe) => RecipeApiActions.editRecipeSuccess({recipe})),
        catchError(() => of(RecipeApiActions.editRecipeFailure()))
      )
    )
  );

  @Effect()
  deleteRecipe$ = this.actions$.pipe(
    ofType(CookbookContainerActions.deleteRecipe),
    filter(({recipe}: { recipe: Recipe }) => !!recipe.id),
    mergeMap(({recipe}: { recipe: Recipe }) => this.recipeService.deleteRecipe(recipe.id!)
      .pipe(
        map(() => CookbookApiActions.deleteRecipeSuccess({deletedRecipe: recipe})),
        catchError(() => of(CookbookApiActions.undoDeleteRecipeFromState({recipe})))
      )
    )
  );

  @Effect()
  chooseActiveCookbookId$ = this.actions$.pipe(
    ofType(CookbookApiActions.loadCookbookSuccess),
    switchMap(({cookbooks}) => {
      const requestedCookbookId = this.route.snapshot.queryParams.selectedCookbookId;
      let selectedCookbookId = requestedCookbookId ? requestedCookbookId : this.storageService.getItem(STORAGE_SELECTED_COOKBOOK_ID);
      const cookbookIds = cookbooks.map((cookbook) => cookbook.id);
      selectedCookbookId = selectedCookbookId && cookbookIds.includes(selectedCookbookId) ?
        selectedCookbookId : cookbookIds[0];
      return of(CookbookApiActions.setActiveCookbookIdAsQueryParam({selectedCookbookId})
      );
    }),
  );

  @Effect({dispatch: false})
  setQueryParameterForActiveShoppingList$ = this.actions$.pipe(
    ofType(CookbookApiActions.setActiveCookbookIdAsQueryParam, CookbookContainerActions.selectCookbook),
    tap(({selectedCookbookId}) => {
      this.router.navigate([], {relativeTo: this.route, queryParams: {selectedCookbookId}});
    })
  );

  @Effect({dispatch: false})
  storeSelectedCookbookIdInStorage = this.actions$.pipe(
    ofType(CookbookApiActions.setActiveCookbookIdAsQueryParam, CookbookContainerActions.selectCookbook),
    tap(({selectedCookbookId}) => {
      this.storageService.setItem(STORAGE_SELECTED_COOKBOOK_ID, selectedCookbookId);
    })
  );

  @Effect()
  createCookbook$ = this.actions$.pipe(
    ofType(CookbookContainerActions.createCookbook),
    exhaustMap(({title, optimisticId}) => this.cookbookService.saveCookbook(title).pipe(
      map((cookbook: Cookbook) => CookbookApiActions.createCookbookSuccess({optimisticId, cookbook})),
      catchError(() => of(CookbookApiActions.createCookbookFailure({optimisticId})))
    ))
  );

  @Effect()
  editCookbook$ = this.actions$.pipe(
    ofType(CookbookContainerActions.editCookbook),
    concatMap(({cookbook}) => this.cookbookService.editCookbook(cookbook).pipe(
      map((editedCookbook: Cookbook) => CookbookApiActions.editCookbookSuccess({cookbook: editedCookbook})),
      catchError(() => of(CookbookApiActions.editCookbookFailure()))
    ))
  );

  @Effect()
  deleteCookbook$ = this.actions$.pipe(
    ofType(CookbookContainerActions.deleteCookbook),
    filter(({cookbook}) => !!cookbook.id),
    mergeMap(({cookbook}) => this.cookbookService.deleteCookbook(cookbook.id!).pipe(
      map(() => CookbookApiActions.deleteCookbookSuccess({cookbook})),
      catchError(() => of(CookbookApiActions.undoDeleteCookbookFromState({cookbook})))
    ))
  );

  @Effect()
  switchCookbookWhenDeleted$ = this.actions$.pipe(
    ofType(CookbookContainerActions.deleteCookbookFromState),
    withLatestFrom(this.store),
    filter(([{cookbook}, store]) => cookbook.id === store.cookbookState.activeCookbookId && store.cookbookState.cookbooks?.length > 0),
    map(([_, store]) => {
      return CookbookContainerActions.selectCookbook({selectedCookbookId: store.cookbookState.cookbooks[0].id});
    })
  );

}
