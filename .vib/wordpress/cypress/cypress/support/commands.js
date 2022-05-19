// Added to slow down Cypress test execution without using hardcoded waits. If removed, there will be false positives.

const COMMAND_DELAY = 1000;

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

const TYPE_DELAY = 100;

for (const command of ['type']) {
  Cypress.Commands.overwrite(command, (originalFn, ...args) => {
    const origVal = originalFn(...args);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(origVal);
      }, TYPE_DELAY);
    });
  });
}

Cypress.Commands.add(
  'login',
  (username = Cypress.env('username'), password = Cypress.env('password')) => {
    cy.clearCookies();
    cy.visit('/wp-login.php');
    cy.get('#user_login').type(username);
    cy.get('#user_pass').type(password);
    cy.get('#wp-submit').click();
  }
);
