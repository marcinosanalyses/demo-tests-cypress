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
    // Log to terminal
    cy.task('log', '🔍 Rozpoczynam test filtrowania ofert pracy po lokalizacji (Warszawa)');
    
    // Navigate to job offers page
    cy.navigateToJobOffers();
    cy.task('log', '✅ Przejście do strony z ofertami pracy');
    
    // Find and click on the region/location filter dropdown
    cy.get('select[name="region[]"]').parent().find('button.multiselect').click();
    cy.task('log', '📋 Otwarcie dropdown z regionami');
    
    // Select Warszawa from the dropdown
    cy.get('.multiselect-container').contains('label', 'Warszawa').click();
    cy.task('log', '✅ Wybrano Warszawę z listy regionów');
    
    // Close the dropdown by clicking outside
    cy.get('body').click();
    
    // Click the submit button
    cy.get('input.searchN-submit').click();
    cy.task('log', '🚀 Wysłanie formularza filtrowania');
    
    // Accept consent banner if it appears
    cy.acceptConsentBanner();
    cy.task('log', '🍪 Obsługa banneru cookies zakończona');
    
    // Wait for results to load
    cy.get('.job_box', { timeout: 10000 }).should('exist');
    cy.task('log', '⏳ Oczekiwanie na załadowanie wyników...');
    
    // Count and log the number of jobs found
    cy.get('.job_box').then(($jobs) => {
      const jobCount = $jobs.length;
      const message = `📊 Znaleziono ${jobCount} ofert pracy w Warszawie`;
      cy.log(message);
      cy.task('log', message);
    });
    
    // Verify at least 1 result is displayed
    cy.get('.job_box').should('have.length.at.least', 1);
    cy.task('log', '✅ Weryfikacja: znaleziono przynajmniej 1 ofertę');
    
    // Verify the results contain Warsaw location
    cy.get('.job_box').first().should('contain.text', 'Warsaw');
    cy.task('log', '✅ Weryfikacja: oferty zawierają lokalizację Warszawa');
    
    // Final log
    cy.task('log', '🎉 Test filtrowania ofert zakończony pomyślnie!');
  });

  it('should switch to English language successfully', () => {
    // Log to terminal
    cy.task('log', '🔁 Rozpoczynam test przełączania języka z PL na EN');
    
    // Switch to English language
    cy.switchLanguage('en');
    cy.task('log', '✅ Przełączono język na angielski');
    
    // Verify we're on English site
    cy.url().should('include', 'diversecg.co.uk');
    cy.task('log', `📋 URL po przełączeniu: ${Cypress.config().baseUrl}`);
    
    // Verify English language is active
    cy.verifyActiveLanguage('en');
    cy.task('log', '✅ Weryfikacja języka zakończona pomyślnie');
    
    // Final log
    cy.task('log', '🎉 Test przełączania języka zakończony pomyślnie!');
  });
});
