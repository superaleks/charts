// Added to slow down Cypress test execution without using hardcoded waits. If removed, there will be false positives.
const COMMAND_DELAY = 2000;

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

//Due to instability of the UI we use a lot of {force:true}. This is a cy.click() wrapper with {force:true} enabled
Cypress.Commands.add(
  'forceClick',
  { prevSubject: 'element' },
  (subject, options) => {
    cy.wrap(subject).click({ force: true });
  }
);

Cypress.on('uncaught:exception', (err, runnable) => {
  // we expect a 3rd party library error with message 'list not defined'
  // and don't want to fail the test so we return false
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  // we still want to ensure there are no other unexpected
  // errors, so we let them fail the test
});
