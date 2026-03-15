describe('DCG Homepage Tests - PL Version', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have valid HTTP status', () => {
    cy.verifyHttpStatus('/');
  });

  it('should load the homepage successfully', () => {
    cy.verifyPageLoaded('dcg.pl');
  });

  it('should display PL language as active', () => {
    cy.verifyActiveLanguage('pl');
  });

  it('should display navigation with 9 clickable menu elements', () => {
    cy.verifyNavigationMenu(9);
  });

  it('should navigate to job offers page and show filters', () => {
    // Navigate to job offers page
    cy.navigateToJobOffers();
    cy.verifyJobSearchForm();
  });

  it('should filter job offers by location and verify results', () => {

    cy.navigateToJobOffers();
    cy.selectRegion('Warszawa');
    
    // Click the submit button
    cy.get('input.searchN-submit').first().click();
    cy.task('log', 'Submitting filter form');
    // Wait for results to load
    cy.get('.job_box', { timeout: 10000 }).should('exist');
    cy.task('log', '⏳ Waiting for results to load...');
    
    // Accept consent banner if it appears
    cy.acceptConsentBanner();
    cy.verifyJobFilterResults('Warszawa','Warsaw');
  });

  it('should switch to English language successfully', () => {
    cy.navigateToJobOffers();
    // Switch to English language
    cy.switchLanguage('en');
    // All commands after navigation to new origin must be wrapped in cy.origin
    cy.origin('https://diversecg.co.uk', () => {
      cy.url().should('include', 'diversecg.co.uk');
      cy.get('.menu-lang-box .menu-lang p.active-lang').should('contain.text', 'en');
    });
  });
});
