import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CookbookContainerComponent } from './containers/cookbook-container/cookbook-container.component';


const routes: Routes = [
  {
    path: '',
    component: CookbookContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CookbookRoutingModule {
}
