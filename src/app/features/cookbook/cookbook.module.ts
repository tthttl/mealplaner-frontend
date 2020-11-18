import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { SharedModule } from '../../shared/shared.module';
import { CookbookPageComponent } from './pages/cookbook-page/cookbook-page.component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { CookbookContainerComponent } from './containers/cookbook-container/cookbook-container.component';
import { RecipeContainerComponent } from './containers/recipe-container/recipe-container.component';
import { CookbookRoutingModule } from './cookbook-routing.module';
import { CookbookEffects } from './store/effects/cookbook.effects';
import { CookbookService } from './services/cookbook.service';
import { RecipeService } from './services/recipe.service';
import { AddRecipeDialogComponent } from './components/add-recipe-dialog/add-recipe-dialog.component';
import { RecipePageComponent } from './pages/recipe-page/recipe-page.component';


@NgModule({
  declarations: [
    RecipePageComponent,
    RecipeListComponent,
    CookbookContainerComponent,
    RecipeContainerComponent,
    AddRecipeDialogComponent,
    CookbookPageComponent,
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([CookbookEffects]),
    CookbookRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    DragDropModule,
    FontAwesomeModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatCheckboxModule,
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
