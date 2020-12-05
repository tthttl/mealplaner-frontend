describe('Login', () => {

  it('should login with valid credentials', () => {
    cy.visit('/auth/login');
    cy.get('input[type=email]').type('test@test.ch');
    cy.get('input[type=password]').type('000000');
    cy.get('.auth-form__button').click();
    cy.location().should(location => expect(location.pathname).to.eq('/shopping-list'));
    Cypress.Cookies.preserveOnce('jrt');
  });

  it('should stay logged in when refresh-token cookie is available', () => {
    cy.visit('/');
    cy.location().should(location => expect(location.pathname).to.eq('/shopping-list'));
  });

  it('should deny login with invalid credentials', () => {
    cy.visit('/auth/login');
    cy.intercept('/auth/local').as('login');

    cy.get('input[type=email]').type('invalid@mealplaner.app');
    cy.get('input[type=password]').type('123456');
    cy.get('.auth-form__button').click();

    cy.wait('@login').its('response.statusCode').should('be.eq', 400);
    cy.location().should(location => expect(location.pathname).to.eq('/auth/login'));
  });

});
