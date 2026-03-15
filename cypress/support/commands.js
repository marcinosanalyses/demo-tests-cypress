// Custom Cypress commands for DCG tests

// Command to verify HTTP status
Cypress.Commands.add('verifyHttpStatus', (path = '/') => {
  cy.request(path).its('status').should('eq', 200);
});

// Command to verify page loaded successfully
Cypress.Commands.add('verifyPageLoaded', (expectedUrl) => {
  cy.url().should('include', expectedUrl);
  cy.title().should('not.be.empty');
});

// Command to verify active language
Cypress.Commands.add('verifyActiveLanguage', (lang) => {
  // Find the element with active-lang class and verify it contains the expected language
  cy.get('.menu-lang-box .menu-lang p.active-lang').should('contain.text', lang);
});

// Command to verify navigation menu
Cypress.Commands.add('verifyNavigationMenu', (minItems = 9) => {
  // Scroll down multiple times to reach the nav
  cy.scrollTo(0, 500);
  cy.scrollTo(0, 1000);
  cy.scrollTo(0, 1500);
  
  // Wait for nav to be visible
  cy.get('nav').first().should('be.visible');
  
  // Verify nav contains at least the minimum menu items
  cy.get('nav ul li').should('have.length.at.least', minItems);
  
  // Verify all visible menu items have clickable links
  cy.get('nav ul li a:visible').should('have.length.at.least', minItems).each(($link) => {
    cy.wrap($link).should('be.visible');
    // Only check href if it exists (some links use click handlers instead)
    if ($link.attr('href')) {
      cy.wrap($link).should('have.attr', 'href').and('not.be.empty');
    }
  });
});
