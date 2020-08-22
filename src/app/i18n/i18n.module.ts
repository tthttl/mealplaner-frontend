import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { I18nApiEffects } from './effects/i18n-api.effects';
import { I18nService } from './services/i18n.service';
import { TranslatePipe } from './pipes/translate.pipe';


@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([I18nApiEffects])
  ],
  declarations: [
    TranslatePipe
  ],
  providers: [
    I18nService
  ],
  exports: [
    TranslatePipe
  ]
})
export class I18nModule {
}
