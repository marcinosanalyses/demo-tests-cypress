describe('DCG Homepage Tests - EN Version', () => {
  beforeEach(() => {
    cy.navigateToPage('enHome');
    cy.url().should('include', 'diversecg.co.uk');
  });

  it('should have valid HTTP status', () => {
    cy.verifyHttpStatus('/english');
  });

  it('should load the English version successfully', () => {
    cy.verifyPageLoaded('diversecg.co.uk');
  });

  it('should display EN language as active', () => {
    cy.verifyActiveLanguage('en');
  });

  it('should display navigation with 9 clickable menu elements', () => {
    cy.verifyNavigationMenu(9);
  });

  it('should navigate to careers page and show filters', () => {
    cy.navigateToPage('enCareers');

    // Check for the multi-select filters
    cy.get('form.searchN').should('exist');
    cy.get('select[name="position[]"]').should('exist').and('have.attr', 'multiple');
    cy.get('select[name="technologies[]"]').should('exist').and('have.attr', 'multiple');
    cy.get('select[multiple]').should('have.length.at.least', 3);
    cy.get('form.searchN').should('have.attr', 'method', 'POST');
    cy.get('form.searchN').should('have.attr', 'action', 'careers');
  });

  it('should navigate to job offers page and show filters', () => {
    cy.navigateToJobOffers();
    cy.verifyJobSearchForm('careers');
 });

 const handleConsentBanner = () => {
  cy.get('body').then(($body) => {
    if ($body.find('.cky-consent-bar').length > 0) {
      cy.get('button[data-cky-tag="accept-button"], button.cky-btn-accept')
        .first()
        .click({ force: true });
    }
  });
};

it('should filter job offers by location and verify results', () => {
    const city = 'Warszawa';
    const expectedText = 'Warsaw'; // Adjust to 'Warszawa' if the results page is in Polish

    // --- 1. Main Process: Navigation & Logging ---
    cy.task('log', `🔍 Starting job filter test for: ${city}`);
    cy.navigateToJobOffers();

    // --- 2. Main Process: Interaction ---
    cy.selectRegion(city);
    cy.get('input.searchN-submit').first().click();
    cy.task('log', '🚀 Form submitted. Redirecting to dcg.pl...');

    // --- 3. Cross-Origin Sandbox ---
    cy.origin('https://dcg.pl', { args: { city, expectedText } }, ({ city, expectedText }) => {
      
      // Internal helper for the cookie banner (since we can't use tasks here)
      const selector = 'button[data-cky-tag="accept-button"], button.cky-btn-accept';
      cy.get('body').then(($body) => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click({ force: true });
        }
      });

      // Assertions: Ensure results exist and contain the text
      cy.get('.job_box', { timeout: 15000 })
        .should('be.visible')
        .and('have.length.at.least', 1)
        .first()
        .should('contain.text', expectedText);

      // Return the number of jobs found back to the main process
      return cy.get('.job_box').its('length');
      
    }).then((jobCount) => {
      cy.task('log', `✅ Success: Found ${jobCount} jobs in ${city} on the results page.`);
    });
  });
});