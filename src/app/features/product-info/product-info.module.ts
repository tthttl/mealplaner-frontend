import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInfoRoutingModule } from './product-info-routing.module';
import { ProductPageContainerComponent } from './containers/product-page-container/product-page-container.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    ProductPageComponent,
    ProductPageContainerComponent,
  ],
  imports: [
    CommonModule,
    ProductInfoRoutingModule,
    SharedModule,
  ]
})
export class ProductInfoModule { }
