import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategyService } from './core/services/custom-preloading-strategy.service';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/product-info/product-info.module').then(m => m.ProductInfoModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'shopping-list',
    data: {usedBy: ['cookbook', 'meal-planer']},
    loadChildren: () => import('./features/shopping-list/shopping-list.module').then(m => m.ShoppingListModule)
  },
  {
    path: 'cookbook',
    data: {usedBy: ['meal-planer']},
    loadChildren: () => import('./features/cookbook/cookbook.module').then(m => m.CookbookModule)
  },
  {
    path: 'meal-planer',
    loadChildren: () => import('./features/meal-planer/meal-planer.module').then(m => m.MealPlanerModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: CustomPreloadingStrategyService})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
