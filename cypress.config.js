module.exports = {
  // The rest of the Cypress config options go here...
  projectId: "ot9ks7",

  defaultCommandTimeout: 10000,

  e2e: {
    baseUrl: "http://localhost:8081",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
