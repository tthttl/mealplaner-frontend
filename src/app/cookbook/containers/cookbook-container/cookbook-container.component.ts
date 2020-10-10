import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { I18n, Language, Recipe } from '../../../shared/model/model';
import { DialogService } from '../../../shared/services/dialog.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { GlobalState, selectRecipes, selectTranslations } from '../../../shared/state';
import { CookbookApiActions, RecipeApiActions, RecipeStateActions } from '../../actions';
import { RecipeViewComponent } from '../../components/recipe-view/recipe-view.component';

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

  constructor(
    private store: Store<GlobalState>,
    private router: Router,
    private snackBarService: SnackbarService,
    private dialogService: DialogService,
  ) {
    this.translations$ = this.store.select(selectTranslations);
    this.currentLang$ = this.store.select((state: GlobalState) => state.appState.language);
    this.recipes$ = this.store.select(selectRecipes);
  }

  ngOnInit(): void {
    this.store.dispatch(CookbookApiActions.loadCookbook());
  }

  onDeleteRecipe(recipeId: string): void {
    const snackBarRef = this.snackBarService.openSnackBar('message.undo', 'message.action');
    this.store.dispatch(RecipeStateActions.deleteRecipeFromState({recipeId}));
    snackBarRef.afterDismissed().pipe(take(1))
      .subscribe(({dismissedByAction}) => {
        if (dismissedByAction) {
          this.store.dispatch(RecipeApiActions.loadRecipes());
        } else {
          this.store.dispatch(RecipeApiActions.deleteRecipe({recipeId}));
        }
      });
  }

  onEditRecipe(recipeId: string): void {
    this.router.navigate([`/recipe/${recipeId}`]);
  }

  onCreate(): void {
    this.router.navigate(['/recipe']);
  }

  onClickRecipe(recipe: Recipe): void {
    const dialogRef = this.dialogService.openDialog(RecipeViewComponent, recipe);
    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: Recipe | undefined) => {
        if (result) {
          console.log(result); // dispatch AddToMealplaner action
        }
      });
  }

  onInputChanged(searchTerm: string): void {
    this.recipes$ = this.store.select(selectRecipes).pipe(
      map((recipes: Recipe[]) => {
        return recipes.filter((recipe: Recipe) => recipe.title.toLowerCase().includes(searchTerm.toLowerCase()));
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
