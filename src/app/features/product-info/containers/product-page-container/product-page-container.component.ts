import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalState, selectCurrentLanguage, selectTranslations } from '../../../../core/store';
import { Observable } from 'rxjs';
import { I18n, Language } from '../../../../core/models/model';

@Component({
  selector: 'app-product-page-container',
  templateUrl: './product-page-container.component.html',
  styleUrls: ['./product-page-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductPageContainerComponent {
  translations$: Observable<I18n | null> = this.store.select(selectTranslations);
  currentLanguage$: Observable<Language> = this.store.select(selectCurrentLanguage);

  constructor(
    private store: Store<GlobalState>,
  ) {}
}
