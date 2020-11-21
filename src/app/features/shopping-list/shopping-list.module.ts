import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { ShoppingListFormComponent } from './components/shopping-list-form/shopping-list-form.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ShoppingListContainerComponent } from './containers/shopping-list-container/shopping-list-container.component';
import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { ShoppingListPageComponent } from './pages/shopping-list-page/shopping-list-page.component';
import { EffectsModule } from '@ngrx/effects';
import { ShoppingListEffects } from './store/effects/shopping-list.effects';


@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingListFormComponent,
    ShoppingListPageComponent,
    ShoppingListContainerComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    FontAwesomeModule,
    MatCheckboxModule,
    SharedModule,
    ReactiveFormsModule,
    ShoppingListRoutingModule,
    EffectsModule.forFeature([ShoppingListEffects])
  ]
})
export class ShoppingListModule {
}
