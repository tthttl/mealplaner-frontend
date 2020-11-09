import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { LoggedOutGuard } from './shared/guards/logged-out.guard';


const routes: Routes = [
  {
    path: '',
    component: ProductPageComponent,
    canActivate: [LoggedOutGuard]
  },
  {
    path: 'auth',
    loadChildren: () => AuthModule
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
