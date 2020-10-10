import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../../shared/model/model';
import { GlobalState } from '../../shared/state';
import { CookbookApiActions, RecipeApiActions } from '../actions';
import { RecipeService } from '../services/recipe.service';

@Injectable()
export class RecipeEffects {
  constructor(
    private actions$: Actions,
    private recipeService: RecipeService,
    private store: Store<GlobalState>,
    private router: Router
  ) {
  }

  @Effect()
  loadRecipes = this.actions$.pipe(
    ofType(RecipeApiActions.loadRecipes, CookbookApiActions.loadCookbookSuccess, RecipeApiActions.deleteRecipeFailure),
    withLatestFrom(this.store.select(((state: GlobalState) => state.cookbookState.activeCookbookId))),
    switchMap(([_, activeCookbookId]) => this.recipeService.loadRecipes(activeCookbookId)
      .pipe(
        map((recipes: Recipe[]) => RecipeApiActions.loadRecipesSuccess({recipes})),
        catchError(() => of(RecipeApiActions.loadRecipesFailure()))
      )
    )
  );

  @Effect()
  saveRecipe = this.actions$.pipe(
    ofType(RecipeApiActions.createRecipe),
    withLatestFrom(this.store.select(((state: GlobalState) => state.cookbookState.activeCookbookId))),
    switchMap(([action, activeCookbookId]) => this.recipeService.saveRecipe(activeCookbookId, action.recipeToSave)
      .pipe(
        map((recipe: Recipe) => RecipeApiActions.createRecipeSuccess({savedRecipe: recipe})),
        catchError(() => of(RecipeApiActions.createRecipeFailure()))
      )
    )
  );

  @Effect({dispatch: false})
  navigateToCookbook = this.actions$.pipe(
    ofType(RecipeApiActions.createRecipeSuccess, RecipeApiActions.editRecipeSuccess),
    tap(() => this.router.navigate(['/cookbook']))
  );

  @Effect()
  editRecipe = this.actions$.pipe(
    ofType(RecipeApiActions.editRecipe),
    withLatestFrom(this.store.select(((state: GlobalState) => state.cookbookState.activeCookbookId))),
    switchMap(([action, cookbookId]) => this.recipeService.editRecipe(cookbookId, action.recipeToEdit)
      .pipe(
        map((recipe: Recipe) => RecipeApiActions.editRecipeSuccess({editedRecipe: recipe})),
        catchError(() => of(RecipeApiActions.editRecipeFailure()))
      )
    )
  );

  @Effect()
  deleteRecipe = this.actions$.pipe(
    ofType(RecipeApiActions.deleteRecipe),
    switchMap(({recipeId}: { recipeId: string }) => this.recipeService.deleteRecipe(recipeId)
      .pipe(
        map(() => RecipeApiActions.deleteRecipeSuccess({recipeId})),
        catchError(() => of(RecipeApiActions.deleteRecipeFailure()))
      )
    )
  );
}
