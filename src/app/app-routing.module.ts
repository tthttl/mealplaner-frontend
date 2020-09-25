import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => AuthModule
  },
  {
    path: 'shopping-list',
    loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule)
  },
  {
    path: 'meal-planer',
    loadChildren: () => import('./meal-planer/meal-planer.module').then(m => m.MealPlanerModule)
  },
  {
    path: 'cookbook',
    loadChildren: () => import('./cookbook/cookbook.module').then(m => m.CookbookModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
