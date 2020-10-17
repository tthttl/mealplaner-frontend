import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { I18nModule } from '../i18n/i18n.module';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { ShoppingListFormComponent } from './components/shopping-list-form/shopping-list-form.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ShoppingListContainerComponent } from './containers/shopping-list-container/shopping-list-container.component';
import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { ShoppingListPageComponent } from './components/shopping-list-page/shopping-list-page.component';
import { EffectsModule } from '@ngrx/effects';
import { AuthApiEffects } from '../auth/effects/auth-api.effects';
import { ShoppingListApiEffects } from './effects/shopping-list-api.effects';


@NgModule({
  declarations: [ShoppingListComponent, ShoppingListFormComponent, ShoppingListContainerComponent, ShoppingListPageComponent],
  imports: [
    CommonModule,
    DragDropModule,
    FontAwesomeModule,
    MatCheckboxModule,
    I18nModule,
    SharedModule,
    ReactiveFormsModule,
    ShoppingListRoutingModule,
    EffectsModule.forFeature([ShoppingListApiEffects])
  ]
})
export class ShoppingListModule {
}
