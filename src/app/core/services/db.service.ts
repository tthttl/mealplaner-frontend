import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { ShoppingListItemDB, SyncItem } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class DBService {

  dataBase: IDBPDatabase<ShoppingListItemDB> | undefined;

  constructor() {
    this.createDataBase()
      .then((database: IDBPDatabase<ShoppingListItemDB>) => this.dataBase = database)
      .catch((err) => console.log('IndexedDB could not be created \n') + err);
  }

  async createDataBase(): Promise<IDBPDatabase<ShoppingListItemDB>> {
    return await openDB<ShoppingListItemDB>('shoppingListItems', 2, {
      upgrade(db: IDBPDatabase<ShoppingListItemDB>): void {
        db.createObjectStore('syncItems', {
          keyPath: 'keyPath',
        });
      },
    });
  }

  write(item: SyncItem): Promise<void> {
    if (this.dataBase) {
      const transaction = this.dataBase.transaction('syncItems', 'readwrite');
      const store = transaction.objectStore('syncItems');
      return store.put(item).then(() => transaction.done);
    }
    return Promise.reject();
  }

}


