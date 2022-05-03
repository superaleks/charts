const COMMAND_DELAY = 500;

for (const command of ['click']) {
  Cypress.Commands.overwrite(command, (originalFn, ...args) => {
    const origVal = originalFn(...args);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(origVal);
      }, COMMAND_DELAY);
    });
  });
}

Cypress.Commands.add(
  'login',
  (username = Cypress.env('username'), password = Cypress.env('password')) => {
    cy.visit('login?do=login&sectok=');
    cy.get('#login');
    cy.get('input[name="u"]').type(username);
    cy.get('input[name="p"]').type(password);
    cy.contains('button', 'Log In').click();
  }
);
