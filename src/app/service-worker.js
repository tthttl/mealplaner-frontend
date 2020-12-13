importScripts('./idb.js');
importScripts('./ngsw-worker.js');

const dataBase = 'shoppingListItems';
const objectStore = 'syncItems';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';
const URL = 'https://beta.mealplaner.app/api'

self.addEventListener('sync', (event) => {
  if (event.tag === 'ShoppingListItems') {
    event.waitUntil(backgroundSync());
  }
});

async function backgroundSync() {
  let syncItems = await getAllSyncItems();
  syncItems = syncItems.sort((a, b) => a.timeStamp - b.timeStamp);
  let synchronizedItems = 0;
  while(syncItems.length > synchronizedItems){
    await syncItemWithServer(syncItems[synchronizedItems]);
    if(syncItems[synchronizedItems].method === POST){
      await backgroundSync();
      break;
    }
    synchronizedItems++;
  }
}

async function syncItemWithServer(item) {
  switch (item.method) {
    case POST:
      console.log('POSTING');
      const response = await send(item, POST);
      const savedItem = await response.json();
      await replaceOptimisticIdsWithServerIdInDB(item.payload.id, savedItem.id);
      await deleteItemFromDB(item.keyPath);
      break;
    case PUT:
      console.log('PUTTING');
      await send(item, PUT);
      await deleteItemFromDB(item.keyPath);
      break;
    case DELETE:
      console.log('DELETING');
      await send(item, DELETE);
      await deleteItemFromDB(item.keyPath);
      break;
    default:
      throw 'Invalid method for synchronization';
  }
}

function send(item, method) {
  const url = method === POST ? URL : URL + '/' + item.payload.id;
  const body = {
    title: item.payload.basicShoppingListItem.title,
    amount: item.payload.basicShoppingListItem.amount,
    unit: item.payload.basicShoppingListItem.unit,
    shoppingList: item.payload.basicShoppingListItem.shoppingList,
    order: item.payload.order
  }
  if (method !== POST) {
    body.id = item.payload.id;
  }
  return fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + item.jwt
    },
    body: JSON.stringify(body)
  })
    .then((response) => {
      return Promise.resolve(response);
    })
    .catch((error) => {
      console.log('Failed in FETCH');
      console.log(error);
      return Promise.reject();
    });
}

function getAllSyncItems() {
  return idb.open(dataBase, 2)
    .then((db) => {
      const tx = db.transaction(objectStore, 'readonly');
      const store = tx.objectStore(objectStore);
      return store.getAll();
    });
}

function replaceOptimisticIdsWithServerIdInDB(optimisticId, serverId) {
  return idb.open(dataBase, 2)
    .then(async (db) => {
      const tx = db.transaction(objectStore, 'readwrite');
      const store = tx.objectStore(objectStore);
      const items = await store.getAll();
      return Promise.all(
        items.map(item => {
          console.log('Searching for items with id: ' + optimisticId);
          if (item.payload.id === optimisticId) {
            console.log(item);
            item.payload.id = serverId;
          }
          return item;
        })
          .map(item => {
            console.log('Updating item with new server id: ' + item.payload.id);
            return store.put(item);
          }))
        .then(() => tx.done);
    });
}

function deleteItemFromDB(key){
  return idb.open(dataBase, 2)
    .then(function (db) {
      const tx = db.transaction(objectStore, 'readwrite');
      const store = tx.objectStore(objectStore);
      console.log('deleting item: ' + key);
      return store.delete(key).then(() => tx.done);
    });
}

function refreshToken() {
  console.log('Fetching JWT - Include');
  return fetch(URL +'/auth/refresh-token', {
    method: 'POST',
    body: {},
    credentials: 'same-origin'
  })
    .then(async response => {
      const parsedRes = await response.json();
      console.log(parsedRes);
      return parsedRes.jwt;
    })
    .catch(err => {
      console.log('Fetching Refresh Token Failed')
      console.log(err);
    });
}
