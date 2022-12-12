
describe('Diceware', () => {

  it('Roll 2 dice and check results', () => {

    cy.visit('/');

    cy.get('[data-test="button-2"]').click();
    cy.get('[data-test="button"]').click();

    cy.get('.results > .results_phrase_key').should("exist").contains("passphrase");

    cy.get('[data-test-num-dice]')
        .should("exist")
        .contains(2)
        ;

  })

  it('Roll 4 dice and check results', () => {

    cy.visit('/');

    cy.get('[data-test="button-4"]').click();
    cy.get('[data-test="button"]').click();

    cy.get('.results > .results_phrase_key').should("exist").contains("passphrase");

    cy.get('[data-test-num-dice]')
        .should("exist")
        .contains(4)
        ;

  })


})
