import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { v4 as uuid } from 'uuid';
import { BasicShoppingListItem, ShoppingListItem, SyncItem, SyncMethod } from '../models/model';
import { GlobalState } from '../store';
import { SyncServiceActions } from '../store/actions';
import { DBService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  constructor(
    private dbService: DBService,
    private store: Store<GlobalState>
  ) {
    window.addEventListener('offline', () => store.dispatch(SyncServiceActions.setOfflineMode({isOffline: true})));
    window.addEventListener('online', () => store.dispatch(SyncServiceActions.setOfflineMode({isOffline: false})));
  }

  registerForSync(item: SyncItem): Observable<void> {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      return fromPromise(this.dbService.write(item)
        .then(() => {
          return navigator.serviceWorker.ready
            .then(registration => registration.sync.register('ShoppingListItems')
              .then(() => console.log('Sync Successfully registered'))
              .catch((err) => console.log('Register for sync failed \n' + err)));
        }));
    }
    return throwError('Offline Mode is not available');
  }

  createSyncItemForPost(basicShoppingListItem: BasicShoppingListItem, jwt: string, optimisticId: string): SyncItem {
    return {
      payload: {
        basicShoppingListItem,
        id: optimisticId,
        order: null
      },
      keyPath: uuid(),
      timeStamp: new Date().getTime(),
      method: 'POST',
      jwt
    };
  }

  createSyncItem(shoppingListItem: ShoppingListItem, jwt: string, method: SyncMethod): SyncItem {
    return {
      payload: {
        basicShoppingListItem: {
          title: shoppingListItem.title,
          amount: shoppingListItem.amount,
          unit: shoppingListItem.unit,
          shoppingList: shoppingListItem.shoppingList
        },
        id: shoppingListItem.id,
        order: shoppingListItem.order || null
      },
      keyPath: uuid(),
      timeStamp: new Date().getTime(),
      method,
      jwt
    };
  }

}
