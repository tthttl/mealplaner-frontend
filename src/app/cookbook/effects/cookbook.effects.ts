import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Cookbook, Recipe } from '../../shared/model/model';
import { GlobalState } from '../../shared/state';
import { CookbookActions, CookbookApiActions } from '../actions';
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
  ) {
  }

  @Effect()
  loadCookbooks = this.actions$.pipe(
    ofType(CookbookActions.loadCookbook),
    switchMap(() => this.cookbookService.loadCookbooks('5f1d4b9ed6ace683b709db8d').pipe( // select userId from state
      map((cookbooks: Cookbook[]) => CookbookApiActions.loadCookbookSuccess({cookbooks})),
      catchError(() => of(CookbookApiActions.loadCookbookFailure()))
    ))
  );

  @Effect()
  loadRecipes = this.actions$.pipe(
    ofType(CookbookActions.loadRecipes, CookbookApiActions.loadCookbookSuccess),
    withLatestFrom(this.store.select(((state: GlobalState) => state.cookbookState.activeCookbookId))),
    switchMap(([_, activeCookbookId]) => this.recipeService.loadRecipes(activeCookbookId)
      .pipe(
        map((recipes: Recipe[]) => CookbookApiActions.loadRecipesSuccess({ cookbookId: activeCookbookId, recipes})),
        catchError(() => of(CookbookApiActions.loadRecipesFailure()))
      )
    )
  );

  @Effect()
  saveRecipe = this.actions$.pipe(
    ofType(CookbookActions.createRecipe),
    withLatestFrom(this.store.select(((state: GlobalState) => state.cookbookState.activeCookbookId))),
    switchMap(([action, activeCookbookId]) => this.recipeService.saveRecipe(activeCookbookId, action.recipeToSave)
      .pipe(
        map((recipe: Recipe) => CookbookApiActions.createRecipeSuccess({ optimisticId: action.optimisticId, savedRecipe: recipe})),
        catchError(() => of(CookbookApiActions.createRecipeFailure({optimisticId: action.optimisticId, cookbookId: activeCookbookId})))
      )
    )
  );

  @Effect({dispatch: false})
  navigateToCookbook = this.actions$.pipe(
    ofType(CookbookApiActions.createRecipeSuccess, CookbookApiActions.editRecipeSuccess),
    tap(() => this.router.navigate(['/cookbook']))
  );

  @Effect()
  editRecipe = this.actions$.pipe(
    ofType(CookbookActions.editRecipe),
    withLatestFrom(this.store.select(((state: GlobalState) => state.cookbookState.activeCookbookId))),
    switchMap(([action, cookbookId]) => this.recipeService.editRecipe(cookbookId, action.recipeToEdit)
      .pipe(
        map((recipe: Recipe) => CookbookApiActions.editRecipeSuccess({editedRecipe: recipe})),
        catchError(() => of(CookbookApiActions.editRecipeFailure()))
      )
    )
  );

  @Effect()
  deleteRecipe = this.actions$.pipe(
    ofType(CookbookActions.deleteRecipe),
    filter(({recipe}: { recipe: Recipe }) => !!recipe.id),
    switchMap(({recipe}: { recipe: Recipe }) => this.recipeService.deleteRecipe(recipe.id!)
      .pipe(
        map(() => CookbookApiActions.deleteRecipeSuccess({deletedRecipe: recipe})),
        catchError(() => of(CookbookApiActions.undoDeleteRecipeFromState({recipe})))
      )
    )
  );

}
