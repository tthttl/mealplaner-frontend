const dataBase = 'shoppingListItems';
const objectStore = 'syncItems';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';
const BASE_URL = 'https://beta.mealplaner.app/api'

try{
  self.importScripts('ngsw-worker.js', 'idb.js');
} catch(error){
  console.log(error)
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'ShoppingListItems') {
    event.waitUntil(backgroundSync());
  }
});

async function backgroundSync(){
  const jwt = await refreshToken();
  try {
    await executeSync(jwt);
  } catch (error){
    console.log('backgroundSync Failed');
    throw error;
  }
}

async function executeSync(jwt) {
  let syncItems = await getAllSyncItems();
  syncItems = syncItems.sort((a, b) => a.timeStamp - b.timeStamp);
  let synchronizedItems = 0;
  while(syncItems.length > synchronizedItems){
    await syncItemWithServer(syncItems[synchronizedItems], jwt);
    if(syncItems[synchronizedItems].method === POST){
      await executeSync(jwt);
      break;
    }
    synchronizedItems++;
  }
}

async function syncItemWithServer(item, jwt) {
  switch (item.method) {
    case POST:
      console.log('POSTING');
      const response = await send(item, POST, jwt);
      const savedItem = await response.json();
      await replaceOptimisticIdsWithServerIdInDB(item.payload.id, savedItem.id);
      await deleteItemFromDB(item.keyPath);
      break;
    case PUT:
      console.log('PUTTING');
      await send(item, PUT, jwt);
      await deleteItemFromDB(item.keyPath);
      break;
    case DELETE:
      console.log('DELETING');
      await send(item, DELETE, jwt);
      await deleteItemFromDB(item.keyPath);
      break;
    default:
      throw 'Invalid method for synchronization';
  }
}

function send(item, method, jwt) {
  const url = method === POST ? BASE_URL + '/shopping-list-items/' : BASE_URL + '/shopping-list-items/' + item.payload.id;
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
      'Authorization': 'Bearer ' + jwt
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
  return fetch(BASE_URL +'/auth/refresh-token', {
    method: 'GET',
    credentials: 'same-origin'
  })
    .then(async response => {
      const parsedResponse = await response.json();
      console.log(parsedResponse);
      return parsedResponse.user.jwt;
    })
    .catch(err => {
      console.log('Fetching Refresh Token Failed')
      console.log(err);
    });
}
