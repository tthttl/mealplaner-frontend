import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { I18n, Language, Translations } from '../../models/model';
import { GlobalState, selectCurrentLanguage, selectTranslations } from '../../store';

import { BetaTeaserComponent } from './beta-teaser.component';

describe('BetaTeaserComponent', () => {
  let component: BetaTeaserComponent;
  let fixture: ComponentFixture<BetaTeaserComponent>;
  let mockStore: MockStore;
  let mockI18nSelector: MemoizedSelector<GlobalState, I18n>;
  let mockLanguageSelector: MemoizedSelector<GlobalState, Language>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BetaTeaserComponent, TranslatePipe],
      providers: [
        provideMockStore()
      ]
    })
      .compileComponents();
    mockStore = TestBed.inject(MockStore);
    mockI18nSelector = mockStore.overrideSelector(selectTranslations, {
      en: {} as Translations
    });
    mockLanguageSelector = mockStore.overrideSelector(selectCurrentLanguage, 'de');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetaTeaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
