importScripts('./ngsw-worker.js');

self.addEventListener('sync', (event) => {
  console.log(event);
  if (event.tag === 'ShoppingListItem - POST') {
    event.waitUntil(postShoppingListItems());
  }
});

function postShoppingListItems() {
  // TODO loop through all items in IndexedDB, then delete them, when fetch successful
  // TODO add url in environment
  const item = {
    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMWQ0YjllZDZhY2U2ODNiNzA5ZGI4ZCIsImlhdCI6MTYwNzI3NDk1NywiZXhwIjoxNjA3ODc5NzU3fQ.tcnZk1qdr4xw_ltLGocybixz5m3x5P6J-UA5u1hb9nE",
    amount: "1",
    unit: "pack",
    title: "Pasta",
    shoppingList: "5f9eff25b79f0403d33f5307"
  };

  console.log('Posting item');
  // TODO extract fetch to call it inside the loop
  fetch('http://localhost:1337/shopping-list-items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + item.jwt
    },
    body: JSON.stringify(item)
  })
    .then((result) => {
      console.log('Successfully posted');
      console.log(result);
      return Promise.resolve();
    })
    .catch((error) => {
      console.log('Posting failed in FETCH');
      console.log(error);
      return Promise.reject();
    });

}

function refreshToken() {
  console.log('Fetching JWT - Include');
  return fetch('http://localhost:1337/auth/refresh-token', {
    method: 'POST',
    body: {},
    credentials: 'same-origin'
  })
    .then(response => {
      const parsedRes = response.json();
      console.log(parsedRes);
      return parsedRes.jwt;
    })
    .catch(err => {
      console.log('Fetching Refresh Token Failed')
      console.log(err);
    });
}
