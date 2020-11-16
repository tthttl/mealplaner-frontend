import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { I18n, Language, Recipe } from '../../../../core/models/model';
import { GlobalState, selectActiveCookbook, selectTranslations } from '../../../../core/store';
import { CookbookContainerActions } from '../../store/actions';

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
      this.recipe$ = this.store.select(selectActiveCookbook).pipe(
        switchMap((activeCookbookId: string) => this.store
          .select((state: GlobalState) => state.cookbookState.recipes[activeCookbookId])
        ),
        map((recipes: Recipe[]) => {
          return recipes.find((recipe: Recipe) => recipe.id === this.id);
        })
      );
    }
  }

  onRecipeSaved(recipe: Recipe): void {
    !!this.id ?
      this.store.dispatch(CookbookContainerActions.editRecipe({recipeToEdit: recipe})) :
      this.store.select(selectActiveCookbook).pipe(
        take(1)
      ).subscribe((activeCookbookId: string) => this.store.dispatch(CookbookContainerActions.createRecipe({
          optimisticId: uuid(),
          recipeToSave: {
            ...recipe,
            cookbookId: activeCookbookId
          }
        }))
      );
  }

}
