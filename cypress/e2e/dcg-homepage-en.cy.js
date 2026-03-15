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
    // Navigate to job offers page
    cy.navigateToJobOffers();
    
    // Check for the multi-select filters
    cy.get('form.searchN').should('exist');
    
    // Check position filter
    cy.get('select[name="position[]"]').should('exist').and('have.attr', 'multiple');
    
    // Check technologies filter
    cy.get('select[name="technologies[]"]').should('exist').and('have.attr', 'multiple');
    
    // Check for other multi-select filters
    cy.get('select[multiple]').should('have.length.at.least', 3);
    
    // Verify the form has search functionality
    cy.get('form.searchN').should('have.attr', 'method', 'POST');
    cy.get('form.searchN').should('have.attr', 'action', 'careers');
  });

  it('should filter job offers by location and verify results', () => {
    // Navigate to job offers page
    cy.log('Starting job offers filter test');
    cy.navigateToJobOffers();
    
    // Log current URL to debug
    cy.url().then((url) => {
      cy.log(`URL after navigateToJobOffers: ${url}`);
    });
    
    // Find and click on the region/location filter dropdown
    cy.get('select[name="region[]"]').parent().find('button.multiselect').click();
    
    // Select Warszawa from the dropdown
    cy.get('.multiselect-container').contains('label', 'Warszawa').click();
    
    // Close the dropdown by clicking outside
    cy.get('body').click();
    
    // Click the submit button - this will cause cross-origin navigation to dcq.pl
    cy.get('input.searchN-submit').click();
    
    // We're navigating to Polish site (dcg.pl), so we need cy.origin
    cy.origin('https://dcg.pl', () => {
      // Handle consent banner if it appears (can't use custom command inside cy.origin)
      cy.get('body').then(($body) => {
        const banner = $body.find('.cky-consent-bar');
        if (banner.length > 0) {
          cy.log('Consent banner found, attempting to accept');
          
          // Find and click the accept button
          const acceptButton = banner.find('button[data-cky-tag="accept-button"]');
          if (acceptButton.length > 0) {
            cy.wrap(acceptButton).click({ force: true });
            cy.log('Clicked accept button');
          } else {
            // Try alternative selectors
            cy.get('button.cky-btn-accept').click({ force: true });
            cy.log('Clicked accept button using class selector');
          }
          
          // Wait a moment for any animation
          cy.wait(1000);
          
          // Check if banner is still visible (not whether it exists)
          cy.get('.cky-consent-bar').then(($banner) => {
            if ($banner.length > 0) {
              // Banner still exists in DOM, check if it's visible
              const isVisible = $banner.is(':visible');
              if (isVisible) {
                cy.log('Banner is still visible after click, trying one more time');
                // Try clicking by text as last resort
                cy.contains('button', 'Accept All').click({ force: true });
                cy.wait(1000);
              } else {
                cy.log('Banner exists in DOM but is not visible - this is OK');
              }
            }
          });
        } else {
          cy.log('No consent banner found');
        }
      });
      
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
  });
});
