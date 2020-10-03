import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../../shared/model/model';
import { GlobalState } from '../../shared/state';
import { CookbookApiActions, RecipeApiActions } from '../actions';
import { RecipeService } from '../services/recipe.service';

@Injectable()
export class RecipeEffects {
  constructor(
    private actions$: Actions,
    private recipeService: RecipeService,
    private store: Store<GlobalState>
  ) {
  }

  @Effect()
  loadRecipes = this.actions$.pipe(
    ofType(RecipeApiActions.loadRecipes, CookbookApiActions.loadCookbookSuccess),
    withLatestFrom(this.store.select(((state: GlobalState) => state.cookbookState.activeCookbookId))),
    switchMap(([_, activateCookbookId]) => this.recipeService.loadRecipes(activateCookbookId)
      .pipe(
        map((recipes: Recipe[]) => RecipeApiActions.loadRecipesSuccess({recipes})),
        catchError(() => of(RecipeApiActions.loadRecipesFailure()))
      )
    )
  );
}
