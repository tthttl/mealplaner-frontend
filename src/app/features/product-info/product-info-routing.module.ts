import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPageContainerComponent } from './containers/product-page-container/product-page-container.component';
import { LoggedOutGuard } from '../../core/guards/logged-out.guard';


const routes: Routes = [
  {
    path: '',
    component: ProductPageContainerComponent,
    canActivate: [LoggedOutGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductInfoRoutingModule {
}
