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

**How to burn a specific test:**
1. Add `.only()` to the test you want to burn in the test file:
   ```javascript
   it.only('should filter job offers by location and verify results', () => {
     // test code
   });
   ```

**Usage examples:**
```bash
# Burn Polish test file (all tests)
npm run burn:pl
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