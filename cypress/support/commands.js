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

// Common page URLs
const pageUrls = {
  plHome: 'https://dcg.pl',
  plCareers: 'https://dcg.pl/kariera',
  enHome: 'https://diversecg.co.uk',
  enCareers: 'https://diversecg.co.uk/careers',
};

// Language selectors map
const languageSelectors = {
  en: '.menu-lang-box .menu-lang a.en-klik',
  pl: '.menu-lang-box .menu-lang a[href*="dcg.pl"], .menu-lang-box .menu-lang a:first-child',
};

// Command to switch languages via the header buttons
Cypress.Commands.add('switchLanguage', (lang) => {
  cy.task('log', `Starting language switch test from PL to ${lang.toUpperCase()}`);
  const selector = languageSelectors[lang];
  if (!selector) {
    throw new Error(`Unknown language ${lang}`);
  }

  if (lang === 'en') {
    cy.get(selector).contains('en').click({ force: true });
  } else if (lang === 'pl') {
    cy.get(selector).contains('pl').click({ force: true });
  } else {
    cy.get(selector).first().click({ force: true });
  }

  cy.task('log', `✅ Switched language to ${lang.toUpperCase()}`);

  const expectedHost = lang === 'en' ? 'diversecg.co.uk' : 'dcg.pl';
  cy.url().should('include', expectedHost);
});

// Command to visit a configured page by key
Cypress.Commands.add('navigateToPage', (pageKey) => {
  const url = pageUrls[pageKey];
  if (!url) {
    throw new Error(`Unknown page key: ${pageKey}`);
  }

  cy.visit(url);
  const path = new URL(url).pathname;
  cy.url().should('include', path);
});

// Command to navigate to job offers page
Cypress.Commands.add('navigateToJobOffers', () => {
  // Scroll down multiple times to reach the nav
  cy.scrollTo(0, 500);
  cy.scrollTo(0, 1000);
  cy.scrollTo(0, 1500);

  // Get current URL to determine which language site we're on
  cy.url().then((currentUrl) => {
    cy.log(`Current URL before navigation: ${currentUrl}`);
    if (currentUrl.includes('diversecg.co.uk')) {
      // We're on English site
      // Try to find and click careers link, if not found, navigate directly
      cy.log('On English site, attempting to navigate to careers page');
      cy.get('body').then(($body) => {
        const careerLinks = $body.find('a[href*="careers"], a[href*="Careers"]');
        if (careerLinks.length > 0) {
          cy.log(`Found ${careerLinks.length} career links, clicking first one`);
          cy.wrap(careerLinks.first()).should('be.visible').click({ force: true });
        } else {
          cy.log('No career links found, navigating directly to careers page');
          cy.visit('https://diversecg.co.uk/careers');
        }
      });
    } else if (currentUrl.includes('dcg.pl')) {
      // We're on Polish site, click Polish kariera link
      cy.log('On Polish site, looking for kariera link');
      cy.get('a[href*="kariera"], a[href*="Kariera"]').then(($links) => {
        cy.log(`Found ${$links.length} kariera links, clicking first one`);
      });
      cy.get('a[href*="kariera"], a[href*="Kariera"]').first().should('exist').and('be.visible').click({ force: true });
    } else {
      throw new Error(`Unknown site origin: ${currentUrl}`);
    }
  });

  // Verify we're on job offers page and still on the correct origin
  cy.url().should((url) => {
    expect(url).to.match(/kariera|careers/);
  });
  cy.url().then((url) => {
    cy.log(`Current URL after navigation: ${url}`);
  });

  // Log to terminal that navigation is complete
  cy.task('log', 'Navigated to job offers page');
});

// Command to navigate directly to the English careers page
Cypress.Commands.add('navigateToCareerPageEnglish', () => {
  cy.visit('https://diversecg.co.uk/careers');
  cy.url().should('include', '/careers');
  
  // Accept consent banner if it appears
  cy.acceptConsentBanner();
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
Cypress.Commands.add('selectRegion', (regionName) => {
  // Open the multiselect dropdown
  cy.get('select[name="region[]"]')
    .parent()
    .find('button.multiselect')
    .first()
    .click();
    
  // Select the specific region from the dropdown
  cy.get('.multiselect-container')
    .contains('label', regionName)
    .click();
    
  // Close the dropdown by clicking outside
  cy.get('body').click();
});

Cypress.Commands.add('verifyJobSearchForm', (formAction = 'kariera') => {
  // Main form container validation using the passed variable
  cy.get('form.searchN')
    .should('exist')
    .and('have.attr', 'method', 'POST')
    .and('have.attr', 'action', formAction);

  // Validate specific select fields exist and are multi-selects
  const filters = ['position[]', 'technologies[]'];
  
  filters.forEach((name) => {
    cy.get(`select[name="${name}"]`)
      .should('exist')
      .and('have.attr', 'multiple');
  });

  // General check for minimum required multi-selects
  cy.get('select[multiple]').should('have.length.at.least', 3);
});


Cypress.Commands.add('verifyJobFilterResults', (location, locationEng) => {
  cy.get('.job_box').then(($jobs) => {
    const jobCount = $jobs.length;
    const message = `Found ${jobCount} job offers in ${location}`;
    
    // Logs to Cypress Test Runner
    cy.log(message);
    
    // Logs to the terminal (requires a 'log' task in cypress.config.js)
    cy.task('log', message);
    
    // Assertion: Ensure we actually found results
    expect(jobCount).to.be.at.least(1);
  });

  // Verify the first result specifically mentions the location
  cy.get('.job_box').first().should('contain.text', locationEng);
});

// Command to accept cookie consent banner if it appears
Cypress.Commands.add('acceptConsentBanner', () => {
  // Check if the consent banner exists
  cy.get('body').then(($body) => {
    const banner = $body.find('.cky-consent-bar');
    if (banner.length > 0) {
      cy.task('log', 'Consent banner found, attempting to accept');
      // Find and click the accept button
      const acceptButton = banner.find('button[data-cky-tag="accept-button"]');
      if (acceptButton.length > 0) {
        cy.wrap(acceptButton).first().click({ force: true });
        cy.task('log', 'Clicked accept button');
      } else {
        // Try alternative selectors
        cy.get('button.cky-btn-accept').first().click({ force: true });
        cy.task('log', 'Clicked accept button using class selector');
      }
      // Wait a moment for any animation
      cy.wait(1000);
      // Check if banner is still visible (not whether it exists)
      cy.get('.cky-consent-bar').then(($banner) => {
        if ($banner.length > 0) {
          // Banner still exists in DOM, check if it's visible
          const isVisible = $banner.is(':visible');
          if (isVisible) {
            cy.task('log', 'Banner is still visible after click, trying one more time');
            // Try clicking by text as last resort
            cy.contains('button', 'Accept All').first().click({ force: true });
            cy.wait(1000);
          } else {
            cy.task('log', 'Banner exists in DOM but is not visible - this is OK');
          }
        }
      });
      cy.task('log', 'Cookie banner handling completed');
    } else {
      cy.task('log', 'No consent banner found');
    }
  });
});
