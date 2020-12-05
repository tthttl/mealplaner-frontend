describe('Navigation', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('Logo should be visible', () => {
    cy.get('.main-navigation__logo')
      .should('be.visible')
      .and('have.attr', 'src',)
      .and('contain', '/assets/logo.svg');
  })

  it('Language Dropdown should change language', () => {
    cy.intercept('GET', '**/api/i18n/de').as('loadI18n');
    cy.get('[data-test=select-language]')
      .as('language-dropdown')
      .should('be.visible')
      .and('contain.value', 'en');
    cy.get('@language-dropdown').select('0: de');
    cy.wait('@loadI18n').its('response.statusCode').should('be.eq', 200);
  })


  it('Button should navigate to Register page', () => {
    cy.get('[data-test=register-link]').click();
    cy.location().should(location => expect(location.pathname).to.eq('/auth/register'));
  })

  it('Button should navigate to Login page', () => {
    cy.get('[data-test=login-link]').click();
    cy.location().should(location => expect(location.pathname).to.eq('/auth/login'));
  })

});
