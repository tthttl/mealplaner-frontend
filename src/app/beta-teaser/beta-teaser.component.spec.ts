import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Translations, TranslationsPerLanguage } from '../shared/model/model';
import { TranslatePipe } from '../shared/pipes/translate.pipe';
import { GlobalState, selectTranslations } from '../shared/state';

import { BetaTeaserComponent } from './beta-teaser.component';

describe('BetaTeaserComponent', () => {
  let component: BetaTeaserComponent;
  let fixture: ComponentFixture<BetaTeaserComponent>;
  let mockStore: MockStore;
  let mockI18nSelector: MemoizedSelector<GlobalState, TranslationsPerLanguage[]>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BetaTeaserComponent, TranslatePipe],
      providers: [
        provideMockStore()
      ]
    })
      .compileComponents();
    mockStore = TestBed.inject(MockStore);
    mockI18nSelector = mockStore.overrideSelector(
      selectTranslations,
      [{
        lang: 'en',
        translations: {} as Translations
      }]
    );
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
