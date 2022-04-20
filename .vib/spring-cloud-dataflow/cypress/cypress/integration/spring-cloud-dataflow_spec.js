/// <reference types="cypress" />
import {
  random,
  importAStreamApplication,
  importATaskApplication,
  createATask,
} from './utils';

it('allows getting Spring Cloud Dataflow info', () => {
  cy.visit('/dashboard');
  cy.get('.signpost-trigger').click();
  cy.contains('.signpost-content-body', 'Version');
  cy.contains('button', 'More info').click();
  cy.contains('.modal-content', 'Core')
    .and('contain', 'Dashboard')
    .and('contain', 'Shell');
});

it('allows a stream to be created', () => {
  importAStreamApplication();
  cy.visit('/dashboard');
  cy.get('[routerlink="streams/list"').click();
  cy.contains('.btn-primary', 'Create stream(s)').click();
  cy.get('.CodeMirror-line').type('mongodb | cassandra');
  cy.get('#v-2').should('contain', 'mongodb').and('contain', 'cassandra');
  cy.contains('button', 'Create stream(s)').click();
  cy.get('.modal-content').should('contain', 'Create Stream');
  cy.fixture('streams').then((stream) => {
    cy.get('input[placeholder="Stream Name"]').type(
      `${stream.newStream.name}-${random}`
    );
    cy.contains('.btn-primary', 'Create the stream').click();
    cy.contains('.modal-content', 'Creating Stream');
    cy.contains(
      '.datagrid-inner-wrapper',
      `${stream.newStream.name}-${random}`
    );
  });
});

it('checks if a task is properly created and schedule a task', () => {
  importATaskApplication();
  createATask();
  cy.visit('/dashboard');
  cy.get('[routerlink="tasks-jobs/tasks"]').click();
  cy.fixture('tasks').then((task) => {
    cy.contains('.datagrid-inner-wrapper', `${task.newTask.name}-${random}`);
  });
  cy.contains('button', 'Schedule').click();
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
  cy.contains('button', 'Destroy task').click(); //remove comments
  cy.contains('.modal-content', 'Confirm Destroy Task');
  cy.contains('button', 'Destroy the task').click();
  cy.get('.toast-container').should('contain', 'destroyed');
});
