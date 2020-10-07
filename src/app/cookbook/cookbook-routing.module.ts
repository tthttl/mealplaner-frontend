import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CookbookContainerComponent } from './containers/cookbook-container/cookbook-container.component';
import { RecipeContainerComponent } from './containers/recipe-container/recipe-container.component';


const routes: Routes = [
  {
    path: '',
    component: CookbookContainerComponent
  },
  {
    path: 'recipe/:id',
    component: RecipeContainerComponent
  },
  {
    path: 'recipe',
    component: RecipeContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CookbookRoutingModule {
}
