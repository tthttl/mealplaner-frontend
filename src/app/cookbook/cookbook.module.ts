import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { I18nModule } from '../i18n/i18n.module';
import { TranslatePipe } from '../i18n/pipes/translate.pipe';
import { SharedModule } from '../shared/shared.module';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { CookbookContainerComponent } from './containers/cookbook-container/cookbook-container.component';
import { CookbookRoutingModule } from './cookbook-routing.module';
import { CookbookEffects } from './effects/cookbook.effects';
import { RecipeEffects } from './effects/recipe.effects';
import { CookbookService } from './services/cookbook.service';
import { RecipeService } from './services/recipe.service';


@NgModule({
  declarations: [RecipeFormComponent, RecipeListComponent, CookbookContainerComponent],
  imports: [
    CommonModule,
    EffectsModule.forFeature([RecipeEffects, CookbookEffects]),
    CookbookRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    I18nModule,
    DragDropModule,
    FontAwesomeModule,
    MatSlideToggleModule
  ],
  providers: [
    {
      provide: TranslatePipe,
      useClass: TranslatePipe
    },
    RecipeService,
    CookbookService
  ]
})
export class CookbookModule {
}
