import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedGuard } from '../../core/guards/authenticated.guard';
import { CookbookContainerComponent } from './containers/cookbook-container/cookbook-container.component';
import { RecipeContainerComponent } from './containers/recipe-container/recipe-container.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthenticatedGuard],
    component: CookbookContainerComponent,
  },
  {
    path: 'recipe/:id',
    canActivate: [AuthenticatedGuard],
    component: RecipeContainerComponent
  },
  {
    path: 'recipe',
    canActivate: [AuthenticatedGuard],
    component: RecipeContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CookbookRoutingModule {
}
