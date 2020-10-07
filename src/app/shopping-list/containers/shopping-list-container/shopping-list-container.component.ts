import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { I18n } from '../../../shared/model/model';
import { GlobalState, selectShoppingListItems, selectShoppingListState, selectTranslations } from '../../../shared/state';
import { ShoppingListContainerActions } from '../../actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list-container',
  templateUrl: './shopping-list-container.component.html',
  styleUrls: ['./shopping-list-container.component.scss']
})
export class ShoppingListContainerComponent implements OnInit {

  shoppingListItems$: Observable<I18n | null> = this.store.select(selectShoppingListItems);

  constructor(private store: Store<GlobalState>) { }

  ngOnInit(): void {
    this.store.dispatch(ShoppingListContainerActions.loadShoppingListItems({id: '5f400b62cd5f2298899f8f43'}));
  }

}
