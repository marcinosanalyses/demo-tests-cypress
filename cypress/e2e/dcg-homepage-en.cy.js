describe('DCG Homepage Tests - EN Version', () => {
  beforeEach(() => {
    // Visit the English version directly
    cy.visit('https://diversecg.co.uk/english');
  });

  it('should have valid HTTP status', () => {
    cy.verifyHttpStatus('/english');
  });

  it('should load the English version successfully', () => {
    cy.verifyPageLoaded('diversecg.co.uk/english');
  });

  it('should display EN language as active', () => {
    cy.verifyActiveLanguage('en');
  });

  it('should display navigation with 9 clickable menu elements', () => {
    cy.verifyNavigationMenu(9);
  });
});
