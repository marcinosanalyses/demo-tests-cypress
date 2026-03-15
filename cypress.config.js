const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '2nsz28',
  e2e: {
    baseUrl: 'https://dcg.pl',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    experimentalOriginDependencies: true,
  },
});
