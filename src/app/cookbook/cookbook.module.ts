import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { I18nModule } from '../i18n/i18n.module';
import { TranslatePipe } from '../i18n/pipes/translate.pipe';
import { SharedModule } from '../shared/shared.module';
import { CookbookPageComponent } from './components/cookbook-page/cookbook-page.component';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeViewComponent } from './components/recipe-view/recipe-view.component';
import { CookbookContainerComponent } from './containers/cookbook-container/cookbook-container.component';
import { RecipeContainerComponent } from './containers/recipe-container/recipe-container.component';
import { CookbookRoutingModule } from './cookbook-routing.module';
import { CookbookEffects } from './effects/cookbook.effects';
import { CookbookService } from './services/cookbook.service';
import { RecipeService } from './services/recipe.service';


@NgModule({
  declarations: [
    RecipeFormComponent,
    RecipeListComponent,
    CookbookContainerComponent,
    RecipeContainerComponent,
    RecipeViewComponent,
    CookbookPageComponent
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([CookbookEffects]),
    CookbookRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    I18nModule,
    DragDropModule,
    FontAwesomeModule,
    MatSlideToggleModule,
    MatDialogModule,
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
