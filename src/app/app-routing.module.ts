import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from './features/auth/auth.module';
import { ShoppingListModule } from './features/shopping-list/shopping-list.module';
import { CookbookModule } from './features/cookbook/cookbook.module';
import { MealPlanerModule } from './features/meal-planer/meal-planer.module';


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
    path: 'cookbook',
    loadChildren: () => CookbookModule
  },
  {
    path: 'meal-planer',
    loadChildren: () => MealPlanerModule,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
