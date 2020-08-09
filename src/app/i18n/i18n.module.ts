import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { I18nApiEffects } from './effects/i18n-api.effects';
import { I18nService } from './services/i18n.service';


@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([I18nApiEffects])
  ],
  declarations: [
  ],
  providers: [
    I18nService
  ]
})
export class I18nModule {
}
