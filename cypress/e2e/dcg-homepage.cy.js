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
});
