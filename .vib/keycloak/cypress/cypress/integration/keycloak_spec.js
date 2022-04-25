/// <reference types="cypress" />
import { random } from './utils';

it('allows login/logout and user manipulation', () => {
  cy.login();
  cy.get('#input-error').should('not.exist');
  cy.get('.dropdown-toggle').click(); //Open user management menu
  //cy.contains('.dropdown-toggle.ng-binding', 'User').click();
  cy.contains('.dropdown-menu li', 'Manage account').click({ force: true });
  cy.contains('p', 'Account console loading').should('not.exist');
  cy.contains('a#landing-personal-info', 'Personal').click();
  cy.get('#email-address').clear().type('test@email.com');
  cy.get('#first-name').clear().type('User');
  cy.get('#last-name').clear().type('Last');
  cy.get('#save-btn').click();
  cy.contains('.pf-c-alert__title', 'has been updated');
  cy.get('#signOutButton').click();
  cy.contains('button#landingSignInButton', 'Sign In');
});

it('allows creating a new user', () => {
  cy.login();
  cy.get('[data-ng-show="access.queryUsers"]').click();
  cy.get('#createUser').click();
  cy.fixture('user').then((user) => {
    cy.get('#username').type(`${user.newUser.username}.${random}`);
    cy.get('#email').type(`${user.newUser.email}.${random}`);
    cy.get('#firstName').type(`${user.newUser.firstName}.${random}`);
    cy.get('#lastName').type(`${user.newUser.lastName}.${random}`);
  });
  cy.contains('button', 'Save').click();
  cy.contains('.alert', 'Success');
});

it('allows the upload and delete of a client ', () => {
  cy.login();
  cy.contains('Import').click();
  cy.get('input#import-file').selectFile(
    'cypress/fixtures/import-client.json',
    {
      force: true,
    }
  );
  cy.contains('button', 'Import').click();
  cy.contains('.alert', 'Success');
  cy.contains('span', 'ADDED');
  cy.get('[data-ng-show="access.queryClients"').click();
  cy.contains('td', 'test-client').siblings('td', 'Delete').last().click();
  cy.contains('button', 'Delete').click();
  cy.contains('.alert', 'Success');
});

it('allows adding and removing an identity provider', () => {
  cy.login();
  cy.contains('a', 'Identity Providers').click();
  cy.get('.form-group > .form-control').select('instagram');
  cy.fixture('identity-provider').then((identity) => {
    cy.get('#clientId').type(`${identity.identityProvider.clientId}.${random}`);
    cy.get('#clientSecret').type(
      `${identity.identityProvider.clientSecret}.${random}`
    );
  });
  cy.contains('button', 'Save').scrollIntoView().click();
  cy.contains('.alert', 'Success');
  cy.contains('a', 'Identity Providers').click();
  cy.contains('td', 'instagram').siblings('td', 'Delete').last().click();
  cy.contains('button', 'Delete').click();
});

it('allows creating a SMTP host', () => {
  cy.login();
  cy.contains('a', 'Email').click();
  cy.fixture('smtp').then((smtp) => {
    cy.get('#smtpHost').clear().type(`${smtp.smtp.host}.${random}`);
    cy.get('#smtpFrom').clear().type(`${smtp.smtp.from}`);
  });
  cy.contains('button', 'Save').click();
  cy.contains('.alert', 'Success');
});
