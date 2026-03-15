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
  const expectedText = 'Warsaw';

  // --- 1. Setup & Navigation ---
  cy.task('log', `🔍 Testing Filter: ${city}`);
  cy.navigateToJobOffers();

  // --- 2. Interaction ---
  cy.selectRegion(city);
  
  // Use .click() with a guard to ensure we don't move on until the page starts unloading
  cy.get('input.searchN-submit').first().click();
  cy.task('log', '🚀 Form submitted. Waiting for redirect...');

  // --- 3. Cross-Origin Validation ---
  const originUrl = 'https://dcg.pl';
  
  // Pass only what is needed to the origin "sandbox"
  cy.origin(originUrl, { args: { city, expectedText } }, ({ city, expectedText }) => {
    
    // Internal Helper: Handle cookie banner quickly
    const acceptCookies = () => {
      const selector = 'button[data-cky-tag="accept-button"], button.cky-btn-accept';
      cy.get('body').then(($body) => {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click({ force: true });
        }
      });
    };

    acceptCookies();

    // --- 4. Assertions ---
    // We combine the check for existence and text content for a cleaner flow
    cy.get('.job_box', { timeout: 12000 })
      .should('be.visible')
      .and('have.length.at.least', 1)
      .first()
      .should('contain.text', expectedText);

    // Final Reporting
    cy.get('.job_box').its('length').then((count) => {
      cy.task('log', `✅ Success: Found ${count} jobs in ${city}`);
    });
  });
});
});