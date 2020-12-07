import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from './features/auth/auth.module';
import { ShoppingListModule } from './features/shopping-list/shopping-list.module';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/product-info/product-info.module').then(m => m.ProductInfoModule)
  },
  {
    path: 'auth',
    loadChildren: () => AuthModule
  },
  {
    path: 'shopping-list',
    loadChildren: () => ShoppingListModule
  },
  {
    path: 'meal-planer',
    loadChildren: () => import('./features/meal-planer/meal-planer.module').then(m => m.MealPlanerModule)
  },
  {
    path: 'cookbook',
    loadChildren: () => import('./features/cookbook/cookbook.module').then(m => m.CookbookModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
