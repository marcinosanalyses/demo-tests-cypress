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
    
    // Check for the 4 multi-select filters
    cy.get('form.searchN').should('exist');
    
    // Check position filter
    cy.get('select[name="position[]"]').should('exist').and('have.attr', 'multiple');
    
    // Check technologies filter (assuming similar structure)
    cy.get('select[name="technologies[]"]').should('exist').and('have.attr', 'multiple');
    
    // Check for other multi-select filters (adjust selectors based on actual page)
    cy.get('select[multiple]').should('have.length.at.least', 3);
    
    // Verify the form has search functionality
    cy.get('form.searchN').should('have.attr', 'method', 'POST');
    cy.get('form.searchN').should('have.attr', 'action', 'kariera');
  });

  it('should filter job offers by location and verify results', () => {
    // Navigate to job offers page
    cy.navigateToJobOffers();
    
    // Find and click on the region/location filter dropdown
    cy.get('select[name="region[]"]').parent().find('button.multiselect').click();
    
    // Select Warszawa from the dropdown
    cy.get('.multiselect-container').contains('label', 'Warszawa').click();
    
    // Close the dropdown by clicking outside
    cy.get('body').click();
    
    // Click the submit button
    cy.get('input.searchN-submit').click();
    
    // Accept consent banner if it appears
    cy.acceptConsentBanner();
    
    // Wait for results to load
    cy.get('.job_box', { timeout: 10000 }).should('exist');
    
    // Count and log the number of jobs found
    cy.get('.job_box').then(($jobs) => {
      const jobCount = $jobs.length;
      const message = `Found ${jobCount} jobs in Warsaw`;
      cy.log(message);
    });
    
    // Verify at least 1 result is displayed
    cy.get('.job_box').should('have.length.at.least', 1);
    
    // Verify the results contain Warsaw location
    cy.get('.job_box').first().should('contain.text', 'Warsaw');
  });
      cy.switchLanguage('en');
});
