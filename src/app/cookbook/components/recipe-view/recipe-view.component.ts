import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { I18n, Language, Recipe } from '../../../shared/model/model';
import { GlobalState, selectTranslations } from '../../../shared/state';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss']
})
export class RecipeViewComponent implements OnInit {

  translations$: Observable<I18n | null>;
  currentLang$: Observable<Language | null>;

  constructor(
    public dialogRef: MatDialogRef<RecipeViewComponent>,
    @Inject(MAT_DIALOG_DATA) public recipe: Recipe,
    private router: Router,
    private store: Store<GlobalState>
  ) {
    this.translations$ = this.store.select(selectTranslations);
    this.currentLang$ = this.store.select((state: GlobalState) => state.appState.language);
  }

  ngOnInit(): void {
  }

  onEdit(): void {
    this.dialogRef.close();
    this.router.navigate([`/recipe/${this.recipe.id}`]);
  }

}
