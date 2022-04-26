/// <reference types="cypress" />
import { random } from './utils.js';
import {
  importAStreamApplication,
  importATaskApplication,
  createATask,
} from './prepare-app-state.js';

it('allows getting Spring Cloud Dataflow info', () => {
  cy.visit('/dashboard');
  cy.get('.signpost-trigger').click();
  cy.contains('.signpost-content-body', 'Version');
  cy.contains('button', 'More info').click();
  cy.contains('.modal-content', 'Core')
    .and('contain', 'Dashboard')
    .and('contain', 'Shell');
});

it('allows a stream to be created and deployed', () => {
  const STREAM = 'mongodb | cassandra';

  importAStreamApplication();
  cy.visit('/dashboard');
  cy.get('[routerlink="streams/list"').click();
  cy.contains('.btn-primary', 'Create stream(s)').click();
  cy.get('.CodeMirror-line').type(STREAM);
  cy.contains('#v-2', 'mongodb').and('contain', 'cassandra');
  cy.contains('button', 'Create stream(s)').click();
  cy.get('.modal-content').should('contain', 'Create Stream');
  cy.fixture('streams').then((stream) => {
    cy.get('input[placeholder="Stream Name"]').type(
      `${stream.newStream.name}-${random}`
    );
    console.log(random);
    cy.contains('.btn-primary', 'Create the stream').click();
    cy.contains(
      '.datagrid-inner-wrapper',
      `${stream.newStream.name}-${random}`
    );
  });
  cy.contains('.toast-container', 'successfully');
  cy.contains('clr-dg-cell', 'UNDEPLOYED')
    .siblings('clr-dg-cell', 'test-stream')
    .first()
    .click();
  cy.contains('button#btn-deploy', 'Deploy stream').click();
  cy.contains('button', 'Deploy stream').click();
  cy.get('.toast-container').should('contain', 'Deploy success');
});

it('allows a task to be scheduled and destroyed', () => {
  const CRON_EXPRESSION = '*/5 * * * *';

  cy.visit('/dashboard');
  importATaskApplication();
  createATask();
  cy.get('[routerlink="tasks-jobs/tasks"]').click();
  cy.contains('clr-dg-cell', 'UNKNOWN')
    .siblings('clr-dg-cell', 'test-task')
    .first()
    .click();
  cy.contains('button', 'Schedule').click();
  cy.fixture('schedules').then((schedule) => {
    cy.get('input[name="example"]')
      .first()
      .type(`${schedule.newSchedule.name}-${random}`);
  });
  cy.get('input[name="example"]').last().type(CRON_EXPRESSION);
  cy.contains('button', 'Create schedule(s)').click();
  cy.contains('.toast-container', 'Successfully');
  cy.contains('a', 'Tasks').click();
  cy.contains('clr-dg-cell', 'UNKNOWN')
    .siblings('clr-dg-cell', 'test-task-')
    .first()
    .click();
  cy.contains('button', 'Destroy task').click();
  cy.contains('.btn-danger', 'Destroy the task').click();
  cy.contains('.toast-container', '1 task definition(s) destroyed.');
});

it('allows importing a task from a file and destroying it ', () => {
  cy.visit('/dashboard');
  cy.get('[routerlink="manage/tools"]').click();
  cy.contains('a', 'Import tasks from a JSON file').click();
  cy.get('input[type="file"]').selectFile(
    'cypress/fixtures/task-to-import.json',
    { force: true }
  );
  cy.contains('button', 'Import').click();
  cy.contains('.modal-body', '1 task(s) created');
  cy.get('.close').click();
  cy.get('[routerlink="tasks-jobs/tasks"]').click();
  cy.contains('button', 'Group Actions').click();
  cy.get('[aria-label="Select All"]').click({ force: true });
  cy.contains('button', 'Destroy task').click();
  cy.contains('.modal-content', 'Confirm Destroy Task');
  cy.contains('button', 'Destroy the task').click();
  cy.get('.toast-container').should('contain', 'destroyed');
});

it('allows unregistering of an application', () => {
  importAStreamApplication();
  cy.get('clr-dg-cell').siblings('clr-dg-cell', 'PROCESSOR').first().click();
  cy.contains('button', 'Unregister Application').click();
  cy.contains('button', 'Unregister the application').click();
  cy.get('.toast-container').should('contain', 'Successfully removed app');
});