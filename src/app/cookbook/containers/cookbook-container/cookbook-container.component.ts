import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { I18n, Language, Recipe } from '../../../shared/model/model';
import { GlobalState, selectRecipes, selectTranslations } from '../../../shared/state';
import { CookbookApiActions } from '../../actions';

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

  constructor(private store: Store<GlobalState>) {
    this.translations$ = this.store.select(selectTranslations);
    this.currentLang$ = this.store.select((state: GlobalState) => state.appState.language);
    this.recipes$ = this.store.select(selectRecipes);
  }

  ngOnInit(): void {
    this.store.dispatch(CookbookApiActions.loadCookbook());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
