describe('Cookbook', () => {

  before(() => {
    cy.login();
  });

  afterEach(() => {
    Cypress.Cookies.preserveOnce('jrt');
  });

  it('should show first cookbook', () => {
    cy.navigateToCookbooks('5f354c276f00a266bb82025c');
    cy.get('.list-header__title').should('contain.text', 'First Cookbook');
    cy.get('.recipe-list__title-box').then(items => {
      expect(items.eq(0).text()).to.contain('Wienerli');
      expect(items.eq(1).text()).to.contain('Cookie');
    });
  });

  it('should select second cookbook', () => {

    cy.get('.list-header__button').click();
    cy.get('.list-picker__item').its('length').should('be.eq', 3);
    cy.intercept({
      method: 'GET',
      path: '/api/recipes?cookbook=5fa51417b79f0403d33f530d*',
    }, {
      statusCode: 200,
      fixture: 'second-recipes.json'
    }).as('second-recipes');
    cy.get('.list-picker__item:last-child').click();
    cy.wait('@second-recipes');
    cy.get('.list-header__title').should('contain.text', 'Second Cookbook');
    cy.get('.recipe-list__title-box').then(items => {
      expect(items.eq(0).text()).to.contain('Gipfeli');
      expect(items.eq(1).text()).to.contain('Mutschli');
    });
  });

  it('should add new element to second cookbook', () => {
    cy.get('[data-test=add-recipe]').click();
    cy.location().should(location => expect(location.pathname).to.eq('/cookbook/recipe'));

    cy.get('input[data-test=recipe-title]').type('Pizza');
    cy.get('input[data-test=recipe-url]').type('pizza.com');
    cy.get('input[data-test=ingredient-amount]').type('1');
    cy.get('select[data-test=ingredient-unit]').select('0: tableSpoon');
    cy.get('input[data-test=ingredient-title]').type('Chili');

    cy.get('[data-test=new-ingredient]').click();

    cy.get('input[data-test=ingredient-amount]').then(list => list.eq(1)).type('2');
    cy.get('select[data-test=ingredient-unit]').then(list => list.eq(1)).select('5: kg');
    cy.get('input[data-test=ingredient-title]').then(list => list.eq(1)).type('Mehl');

    cy.intercept({
      method: 'POST',
      pathname: '/api/recipes',
    }, {statusCode: 200}).as('create-recipe');
    cy.get('[data-test=create-recipe]').click();
    cy.wait('@create-recipe').its('request.body').should('deep.equal', {
      cookbookId: "5fa51417b79f0403d33f530d",
      title: "Pizza",
      url: "pizza.com",
      ingredients: [
        {
          title: "Chili",
          amount: 1,
          unit: "tableSpoon",
          isStapleFood: false
        },
        {
          title: "Mehl",
          amount: 2,
          unit: "kg",
          isStapleFood: false
        }
      ],
      cookbook: "5fa51417b79f0403d33f530d"
    });
  });

  it('should delete first cookbook', () => {
    cy.navigateToCookbooks('5fa51417b79f0403d33f530d');

    cy.get('[data-test=RECIPE-ROW-DELETE]').then(list => list.eq(0)).click();

    cy.intercept({
      method: 'DELETE',
      pathname: '/api/recipes/5fc3c81acd499e1ce864079f',
    }, {statusCode: 200}).as('delete-item');
    cy.wait('@delete-item');

  });

});

