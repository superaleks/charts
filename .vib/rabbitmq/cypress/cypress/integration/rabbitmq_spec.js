/// <reference types="cypress" />
import { random } from './utils';

it('allows login/logout', () => {
  const APP_NAME = 'RabbitMQ';

  cy.login();
  cy.get('#versions').should('contain', APP_NAME);
  cy.contains('.hider', 'Queued messages');
  cy.contains('Log out').click();
  cy.contains('#login', 'Username');
});

it('allows upload of broker definitions', () => {
  cy.login();
  cy.contains('Import definitions').click();
  cy.get('input[type="file"]').selectFile(
    'cypress/fixtures/broker-definitions.json'
  );
  cy.contains('Upload broker definitions').click();
  cy.get('.form-popup-warn').should('not.exist');
  cy.contains('Your definitions were imported successfully');
});

it('allows publishing a message to a created exchange', () => {
  cy.login();
  cy.visit('#/exchanges');
  cy.contains('Add a new exchange').click();
  cy.fixture('exchanges').then((exchange) => {
    cy.get('[name="name"]').type(`${exchange.newExchange.name}${random}`);
    cy.get('#arguments_1_mfkey').type(exchange.newExchange.argument1);
    cy.get('#arguments_1_mfvalue').type(exchange.newExchange.argument2);
    cy.contains('Add exchange')
      .scrollIntoView()
      .should('be.enabled')
      .click({ force: true });
    cy.reload();
    cy.get('table[class="list"]').should(
      'contain',
      `${exchange.newExchange.name}${random}`
    );
    cy.contains('a', `${exchange.newExchange.name}${random}`).click();
  });
  cy.contains('Publish message').click();
  cy.fixture('messages').then((message) => {
    cy.get('textarea')
      .should('not.be.disabled')
      .type(message.newMessage.payload);
  });
  cy.contains('input', 'Publish message').click();
  cy.contains('Message published, but not routed');
});

it('allows adding a new queue and binding/unbinding it to the exchange', () => {
  cy.login();
  cy.visit('#/queues');
  cy.contains('Add a new queue').click();
  cy.fixture('queues').then((queue) => {
    cy.get('[name="name"]').type(`${queue.newQueue.name}${random}`);
    cy.get('#arguments_1_mfkey').type(queue.newQueue.argument1);
    cy.get('#arguments_1_mfvalue').type(queue.newQueue.argument2);
    cy.contains('Add queue').click();
    cy.get('table[class="list"]').should(
      'contain',
      `${queue.newQueue.name}${random}`
    );
  });
  cy.visit('#/exchanges');
  cy.contains('amq.direct').click();
  cy.contains('Bindings').click();
  cy.fixture('queues').then((queue) => {
    cy.get('[name="destination"]').type(`${queue.newQueue.name}${random}`);
    cy.contains('[type="submit"]', 'Bind').click();
    cy.contains('.bindings-wrapper', `${queue.newQueue.name}${random}`);
  });
  cy.contains('Unbind').click();
  cy.contains('no bindings');
});

it('allows adding a new admin and logging in as such', () => {
  const APP_NAME = 'RabbitMQ';

  cy.login();
  cy.visit('/#/users');
  cy.contains('Add a user').click();
  cy.fixture('admins').then((admin) => {
    cy.get('[name="username"').type(`${admin.newAdmin.userName}${random}`);
    cy.get('[name="password"]').type(`${admin.newAdmin.password}${random}`);
    cy.get('[name="password_confirm"]').type(
      `${admin.newAdmin.password}${random}`
    );
    cy.get('#tags').type(admin.newAdmin.tags);
    cy.contains('input[type="submit"]', 'Add user').click();
    cy.get('[class="updatable"]').should(
      'contain',
      `${admin.newAdmin.userName}${random}`
    );
    cy.contains('Log out').click();
    cy.get('[alt="RabbitMQ logo"]');
    cy.get('[name="username"]').type(`${admin.newAdmin.userName}${random}`);
    cy.get('[name="password"]').type(`${admin.newAdmin.password}${random}`);
    cy.contains('Login').click();
    cy.get('#versions').should('contain', APP_NAME);
    cy.contains('Log out');
  });
});
