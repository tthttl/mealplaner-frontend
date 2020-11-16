import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealplanerContainerComponent } from './containers/mealplaner-container/mealplaner-container.component';
import { MealPlanerRoutingModule } from './meal-planer-routing.module';



@NgModule({
  declarations: [MealplanerContainerComponent],
  imports: [
    CommonModule,
    MealPlanerRoutingModule
  ]
})
export class MealPlanerModule { }
