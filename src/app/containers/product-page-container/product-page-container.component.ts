import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalState, selectCurrentLanguage, selectTranslations } from '../../shared/state';
import { Observable } from 'rxjs';
import { I18n, Language } from '../../shared/model/model';

@Component({
  selector: 'app-product-page-container',
  templateUrl: './product-page-container.component.html',
  styleUrls: ['./product-page-container.component.scss']
})
export class ProductPageContainerComponent implements OnInit {
  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language> = this.store.select(selectCurrentLanguage);

  constructor(
    private store: Store<GlobalState>,
  ) {
  }

  ngOnInit(): void {
  }

}
