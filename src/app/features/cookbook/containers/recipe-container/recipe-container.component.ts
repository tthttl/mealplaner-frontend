import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { I18n, Language, Recipe } from '../../../../core/models/model';
import { StorageService } from '../../../../core/services/storage.service';
import { GlobalState, selectActiveCookbookId, selectedRecipe, selectTranslations } from '../../../../core/store';
import { RecipeContainerActions } from '../../store/actions';

@Component({
  selector: 'app-recipe-container',
  templateUrl: './recipe-container.component.html',
  styleUrls: ['./recipe-container.component.scss']
})
export class RecipeContainerComponent implements OnInit {

  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language | null> = this.store.select((state: GlobalState) => state.appState.language);
  id: string | null = '';
  recipe$: Observable<Recipe | undefined> | undefined;

  constructor(
    private store: Store<GlobalState>,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
  ) {
  }

  ngOnInit(): void {
    const selectedCookbookId = this.storageService.getItem('selectedCookbookId');
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.store.dispatch(RecipeContainerActions.loadRecipe({id: this.id!}));
      this.recipe$ = this.store.select(selectedRecipe(selectedCookbookId, this.id));
    }
  }

  onRecipeSaved(recipe: Recipe): void {
    !!this.id ?
      this.store.dispatch(RecipeContainerActions.editRecipe({recipeToEdit: recipe})) :
      this.store.select(selectActiveCookbookId).pipe(
        take(1)
      ).subscribe((activeCookbookId: string) => this.store.dispatch(RecipeContainerActions.createRecipe({
          optimisticId: uuid(),
          recipeToSave: {
            ...recipe,
            cookbookId: activeCookbookId
          }
        }))
      );
  }

}
