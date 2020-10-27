import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Cookbook, Recipe } from '../../shared/model/model';
import { GlobalState } from '../../shared/state';
import { CookbookApiActions, CookbookContainerActions } from '../actions';
import { CookbookService } from '../services/cookbook.service';
import { RecipeService } from '../services/recipe.service';

@Injectable()
export class CookbookEffects {
  constructor(
    private actions$: Actions,
    private cookbookService: CookbookService,
    private store: Store<GlobalState>,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  @Effect()
  loadCookbooks$ = this.actions$.pipe(
    ofType(CookbookContainerActions.loadCookbook),
    exhaustMap(() => this.cookbookService.loadCookbooks('5f1d4b9ed6ace683b709db8d').pipe( // select userId from state
      map((cookbooks: Cookbook[]) => CookbookApiActions.loadCookbookSuccess({cookbooks})),
      catchError(() => of(CookbookApiActions.loadCookbookFailure()))
    ))
  );

  @Effect()
  loadRecipes$ = this.actions$.pipe(
    ofType(CookbookContainerActions.loadRecipes, CookbookApiActions.loadCookbookSuccess, CookbookContainerActions.selectCookbook),
    withLatestFrom(this.store.select(((state: GlobalState) => state.cookbookState.activeCookbookId))),
    concatMap(([_, activeCookbookId]) => this.recipeService.loadRecipes(activeCookbookId)
      .pipe(
        map((recipes: Recipe[]) => CookbookApiActions.loadRecipesSuccess({cookbookId: activeCookbookId, recipes})),
        catchError(() => of(CookbookApiActions.loadRecipesFailure()))
      )
    )
  );

  @Effect()
  saveRecipe$ = this.actions$.pipe(
    ofType(CookbookContainerActions.createRecipe),
    withLatestFrom(this.store.select(((state: GlobalState) => state.cookbookState.activeCookbookId))),
    concatMap(([action, activeCookbookId]) => this.recipeService.saveRecipe(activeCookbookId, action.recipeToSave)
      .pipe(
        map((recipe: Recipe) => CookbookApiActions.createRecipeSuccess({optimisticId: action.optimisticId, savedRecipe: recipe})),
        catchError(() => of(CookbookApiActions.createRecipeFailure({optimisticId: action.optimisticId, cookbookId: activeCookbookId})))
      )
    )
  );

  @Effect({dispatch: false})
  navigateToCookbook$ = this.actions$.pipe(
    ofType(CookbookApiActions.createRecipeSuccess, CookbookApiActions.editRecipeSuccess),
    tap(() => this.router.navigate(['/cookbook']))
  );

  @Effect()
  editRecipe$ = this.actions$.pipe(
    ofType(CookbookContainerActions.editRecipe),
    withLatestFrom(this.store.select(((state: GlobalState) => state.cookbookState.activeCookbookId))),
    concatMap(([action, cookbookId]) => this.recipeService.editRecipe(cookbookId, action.recipeToEdit)
      .pipe(
        map((recipe: Recipe) => CookbookApiActions.editRecipeSuccess({editedRecipe: recipe})),
        catchError(() => of(CookbookApiActions.editRecipeFailure()))
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
      const requestedCookbookId = this.route.snapshot.queryParams.cookbookId;
      const cookbookIds = cookbooks.map((cookbook) => cookbook.id);
      const selectedCookbookId  = requestedCookbookId && cookbookIds.includes(requestedCookbookId) ?
        requestedCookbookId : cookbookIds[0];
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

}
