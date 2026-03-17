# Cypress

## Setup
```bash
npm install                    # Install dependencies
npm run cy:verify              # Verify Cypress installation
```

## Test Execution

### Basic Commands
- `npm run cy:open` - Open Cypress Test Runner
- `npm run cy:run` - Run tests headlessly

### Specific Tests
- `npm run test:pl` - Polish version
- `npm run test:en` - English version  
- `npm run test:all` - All tests
- `npm run test:job-offers` - Job offers (Polish)
- `npm run test:job-offers:headed` - Job offers headed mode
- `npm run test:job-offers:en:headed` - Job offers (English) headed mode

### Burn Tests (Flakiness Check)
- `npm run burn:pl` - Run test:pl 5 times to check for flakiness
- `npm run burn:switch-to-english` - Burn "should switch to English language successfully" test 5 times (requires `.only()` in test file)
- `npm run burn:en-filter-location` - Burn "should filter job offers by location and verify results" test 5 times (requires `.only()` in test file)
- `npm run burn:file -- "cypress/e2e/dcg-homepage.cy.js"` - Burn any test file 5 times
- `npm run burn:test -- "cypress/e2e/dcg-homepage.cy.js"` - Burn specific test file 5 times (requires `.only()` in test file)

**How to burn a specific test:**
1. Add `.only()` to the test you want to burn in the test file:
   ```javascript
   it.only('should filter job offers by location and verify results', () => {
     // test code
   });
   ```
2. Run the burn script for that file:
   ```bash
   npm run burn:en-filter-location
   ```
   or for any file:
   ```bash
   npm run burn:test -- "cypress/e2e/dcg-homepage.cy.js"
   ```

**Usage examples:**
```bash
# Burn Polish test file (all tests)
npm run burn:pl

# Burn specific "switch to English" test (add .only() to test first)
npm run burn:switch-to-english

# Burn specific EN location test (add .only() to test first)
npm run burn:en-filter-location

# Burn any test file
npm run burn:file -- "cypress/e2e/dcg-homepage-en.cy.js"

# Burn specific test file (add .only() to test first)
npm run burn:test -- "cypress/e2e/dcg-homepage.cy.js"

# Burn with custom iterations
for i in {1..10}; do echo "Run $i:" && npm run test:pl; done
```

### Git Commands
```bash
git checkout <branch>         # Switch branch
git checkout -b <branch>      # Create new branch
git add . && git commit -m "msg"  # Add & commit
git push                      # Push changes
git pull                      # Pull latest
```

## Configuration
- Base URL: https://dcg.pl
- Viewport: 1280x720
- Timeout: 10s commands, 30s page load
- Reporter: Mochawesome (HTML reports)
- Video: Disabled, Screenshots: On failure 