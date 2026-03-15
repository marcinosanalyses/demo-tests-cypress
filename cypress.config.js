const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '2nsz28',
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'DCG Cypress Test Report',
    reportFilename: `dcg-test-report-${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}`,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    baseUrl: 'https://dcg.pl',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    experimentalOriginDependencies: true,
    allowCypressEnv: false,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      
      // Add task for logging to console
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
  },
});
