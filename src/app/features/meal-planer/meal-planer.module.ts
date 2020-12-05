import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MealplanerContainerComponent } from './containers/mealplaner-container/mealplaner-container.component';
import { MealPlanerRoutingModule } from './meal-planer-routing.module';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ScheduleControllsComponent } from './components/schedule-controlls/schedule-controlls.component';
import { SharedModule } from '../../shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ScheduleDaysControllsComponent } from './components/schedule-days-controlls/schedule-days-controlls.component';
import { Store } from '@ngrx/store';
import localeDe from '@angular/common/locales/de';
import { GlobalState } from '../../core/store';
import { EffectsModule } from '@ngrx/effects';
import { MealPlanersEffects } from './store/effects/meal-planers.effects';
import { MealplanerPageComponent } from './pages/mealplaner-page/mealplaner-page.component';

registerLocaleData(localeDe);


@NgModule({
  declarations: [
    MealplanerContainerComponent,
    ScheduleComponent,
    ScheduleControllsComponent,
    ScheduleDaysControllsComponent,
    MealplanerPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FontAwesomeModule,
    MealPlanerRoutingModule,
    EffectsModule.forFeature([MealPlanersEffects])
  ],
  providers: [
    {
      provide: LOCALE_ID,
      deps: [Store],
      useFactory: (store: Store<GlobalState>) => {
        let locale;
        store.select((state: GlobalState) => state.appState.language).subscribe(currentLanguage => {
          locale = currentLanguage;
        });
        return locale;
      }
    }
  ]
})
export class MealPlanerModule {
}
