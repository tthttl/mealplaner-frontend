describe('Shopping List', () => {

  before(() => {
    cy.intercept({
      method: 'GET',
      path: '/api/shopping-lists?user=5fdf81ab0fc5d2052d545b01',
    }, {
      statusCode: 200,
      fixture: 'shopping-lists.json'
    }).as('shopping-lists');
    cy.intercept({
      method: 'GET',
      path: '/api/shopping-list-items?shoppingList=5f402198ce81539b32be24b7',
    }, {
      statusCode: 200,
      fixture: 'first-shopping-list-items.json'
    }).as('shopping-list-items');
    cy.login();
    cy.wait('@shopping-lists');
    cy.wait('@shopping-list-items');
  });

  afterEach(() => {
    Cypress.Cookies.preserveOnce('jrt');
  });

  it('should show first shopping-list', () => {
    cy.get('.list-header__title').should('contain.text', 'First Shopping List');
    cy.get('.shopping-list__label').then(items => {
      expect(items.eq(0).text()).to.contain('Sugar');
      expect(items.eq(1).text()).to.contain('Chocolate chip cookie');
    });
  });

  it('should add new element to first shopping-list', () => {

    cy.get('input[data-test=shopping-list-item-amount]').type('1');
    cy.get('select[data-test=shopping-list-item-unit]').select('1: piece');
    cy.get('input[data-test=shopping-list-item-name]').type('Ice Cream');

    cy.intercept({
      method: 'POST',
      pathname: '/api/shopping-list-items',
    }, {statusCode: 200}).as('add-item');
    cy.get('[data-test=add-shopping-list-item]').click();
    cy.wait('@add-item').its('request.body').should('deep.equal', {
      amount:"1",
      unit:"piece",
      title:"Ice Cream",
      shoppingList:"5f402198ce81539b32be24b7"
    });
  });

  it('should delete element', () => {

    cy.get('.shopping-list__item-row-wrapper')
      .then(rowList => rowList.eq(1))
      .find('input[type=checkbox]').check({force: true});

    cy.intercept({
      method: 'DELETE',
      pathname: '/api/shopping-list-items/5fb8f93e4f93d9cf92a9149a',
    }, {statusCode: 200}).as('delete-item');
    cy.wait('@delete-item');
  });

  it('should select second shopping-list', () => {
    cy.navigateToShoppingLists();

    cy.get('.list-header__button').click();
    cy.get('.list-picker__item').its('length').should('be.eq', 3);
    cy.intercept({
      method: 'GET',
      path: '/api/shopping-list-items?shoppingList=5f987dc4c93a64d6e82dc51b',
    }, {
      statusCode: 200,
      fixture: 'second-shopping-list-items.json'
    }).as('second-shopping-list-items');
    cy.get('.list-picker__item:last-child').click();
    cy.wait('@second-shopping-list-items');
    cy.get('.list-header__title').should('contain.text', 'Second Shopping List');
    cy.get('.shopping-list__label').then(items => {
      expect(items.eq(0).text()).to.contain('Salt');
      expect(items.eq(1).text()).to.contain('Cheetos');
    });
  });

});
