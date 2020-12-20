// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  cy.visit('/auth/login');
  cy.get('input[type=email]').type('test@test.ch');
  cy.get('input[type=password]').type('000000');
  cy.get('.auth-form__button').click();
});

Cypress.Commands.add('navigateToShoppingLists', () => {
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
  cy.visit('/');
  cy.wait('@shopping-lists');
  cy.wait('@shopping-list-items');
});

Cypress.Commands.add('navigateToCookbooks', (cookbookId) => {
  cy.intercept({
    method: 'GET',
    path: '/api/cookbooks?user=5fdf81ab0fc5d2052d545b01*',
  }, {
    statusCode: 200,
    fixture: 'cookbooks.json'
  }).as('cookbooks');
  cy.intercept({
    method: 'GET',
    path: `/api/recipes?cookbook=${cookbookId}*`,
  }, {
    statusCode: 200,
    fixture: 'first-recipes.json'
  }).as('recipes');
  cy.get('.desktop-navigation__link[href$=cookbook]').click();
  cy.wait('@cookbooks');
  cy.wait('@recipes');

});


