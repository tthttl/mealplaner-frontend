import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { I18nModule } from '../i18n/i18n.module';
import { TranslatePipe } from '../i18n/pipes/translate.pipe';
import { SharedModule } from '../shared/shared.module';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { CookbookRoutingModule } from './cookbook-routing.module';


@NgModule({
  declarations: [RecipeFormComponent, RecipeListComponent],
  imports: [
    CommonModule,
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
    }
  ]
})
export class CookbookModule {
}
