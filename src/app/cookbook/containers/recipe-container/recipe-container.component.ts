import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18n, Language, Recipe } from '../../../shared/model/model';
import { GlobalState, selectRecipes, selectTranslations } from '../../../shared/state';
import { RecipeApiActions } from '../../actions';

@Component({
  selector: 'app-recipe-container',
  templateUrl: './recipe-container.component.html',
  styleUrls: ['./recipe-container.component.scss']
})
export class RecipeContainerComponent implements OnInit {

  translations$: Observable<I18n | null>;
  currentLang$: Observable<Language | null>;
  id: string | null = '';
  recipe$: Observable<Recipe | undefined> | undefined;

  constructor(
    private store: Store<GlobalState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.translations$ = this.store.select(selectTranslations);
    this.currentLang$ = this.store.select((state: GlobalState) => state.appState.language);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.recipe$ = this.store.select(selectRecipes).pipe(
        map((recipes: Recipe[]) => {
          return recipes.find((recipe: Recipe) => recipe.id === this.id);
        })
      );
    }
  }

  onRecipeSaved(recipe: Recipe): void {
    !!this.id ?
      this.store.dispatch(RecipeApiActions.editRecipe({recipeToEdit: recipe})) :
      this.store.dispatch(RecipeApiActions.createRecipe({recipeToSave: recipe}));
  }

}
