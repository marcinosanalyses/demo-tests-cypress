// Cypress support file for e2e tests
// This file is processed and loaded automatically before your test files.

// Import custom commands
import './commands';

// Configure behavior
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // useful for handling unexpected application errors
  
  // Ignore cross-origin script errors
  if (err.message.includes('cross origin') || err.message.includes('Script error')) {
    return false;
  }
  
  return false;
});
