import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { v4 as uuid } from 'uuid';
import { BasicShoppingListItem, ShoppingListItem, SyncItem, SyncMethod } from '../models/model';
import { DBService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  constructor(private dbService: DBService) {
  }

// TODO put write within if
  registerForSync(item: SyncItem): Observable<void> {
    return fromPromise(this.dbService.write(item)
      .then(() => console.log('Write successful')));
    /*if ('serviceWorker' in navigator && 'SyncManager' in window) {
      return fromPromise(navigator.serviceWorker.ready
        .then(registration => registration.sync.register(SYNC_SHOPPING_LIST_ITEM_POST))
        .catch(err => {
          console.log(`Could not register sync for id ${item.id} \n` + err);
          throwError(`Could not register sync for id ${item.id} \n`);
        }));
    }
    return throwError('Offline Mode is not available');*/
  }

  createSyncItemForPost(basicShoppingListItem: BasicShoppingListItem, jwt: string): SyncItem {
    return {
      payload: {
        basicShoppingListItem,
        id: null,
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
