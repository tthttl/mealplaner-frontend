import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { I18n, Language, Recipe } from '../../../shared/model/model';
import { GlobalState, selectRecipes, selectTranslations } from '../../../shared/state';
import { CookbookApiActions, RecipeApiActions, RecipeStateActions } from '../../actions';

@Component({
  selector: 'app-cookbook-container',
  templateUrl: './cookbook-container.component.html',
  styleUrls: ['./cookbook-container.component.scss']
})
export class CookbookContainerComponent implements OnInit, OnDestroy {

  translations$: Observable<I18n | null>;
  currentLang$: Observable<Language>;
  recipes$: Observable<Recipe[]>;
  private destroy$: Subject<void> = new Subject<void>();
  private timeoutHandlers: number[] = [];

  constructor(
    private store: Store<GlobalState>,
    private router: Router
  ) {
    this.translations$ = this.store.select(selectTranslations);
    this.currentLang$ = this.store.select((state: GlobalState) => state.appState.language);
    this.recipes$ = this.store.select(selectRecipes);
  }

  ngOnInit(): void {
    this.store.dispatch(CookbookApiActions.loadCookbook());
  }

  onDeleteRecipe(recipeId: string): void {
    // show toaster + start timer => when undo is pressed clear timer
    this.store.dispatch(RecipeStateActions.deleteRecipeFromState({recipeId}));
    const handler: number = setTimeout(this.onDeleteTimeoutExpired(recipeId), 1000);
    this.timeoutHandlers.push(handler);
  }

  onDeleteTimeoutExpired(recipeId: string): () => void {
    return () => {
      this.store.dispatch(RecipeApiActions.deleteRecipe({recipeId}));
    };
  }

  onCancelDelete(handler: number): void {
    clearTimeout(handler);
    this.store.dispatch(RecipeApiActions.loadRecipes());
  }

  onEditRecipe(recipeId: string): void {
    this.router.navigate([`/recipe/${recipeId}`]);
  }

  onCreate(): void {
    this.router.navigate(['/recipe']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
