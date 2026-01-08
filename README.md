# Playwright Automation for Transax

This repository stores the code for Transax Automation using Playwright tool.

This project contains Playwright automation tests for Transax login functionality.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a `.env` file** in the root directory with your Transax credentials:
   ```
   TRANSAX_URL=https://dashboard.dev.transax.com/auth/login
   TRANSAX_USERNAME=qamanualtesting.admin@gmail.com
   TRANSAX_PASSWORD=Qatest111!
   ```
   
   Note: A `.env` file has already been created with the provided credentials.

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## Running Tests

### Run the Transax login test:
```bash
npm run test:transax
```

### Run all tests:
```bash
npm test
```

### Run tests in headed mode (see the browser):
```bash
npm run test:headed
```

### Run tests in debug mode:
```bash
npm run test:debug
```

## Authentication State

The project includes a global setup script (`global-setup.ts`) that can save your authentication state after logging in. This allows you to reuse the authenticated session across multiple tests without logging in each time.

To enable this:
1. Uncomment the `globalSetup` line in `playwright.config.ts`
2. Uncomment the `storageState` line in the `use` section of `playwright.config.ts`
3. Run your tests - the authentication state will be saved automatically

## Notes

- Make sure your `.env` file is in `.gitignore` to keep your credentials secure
- The login script tries multiple common selectors to find username, password, and login button fields
- If the login page structure is different, you may need to update the selectors in `tests/transax-login.spec.ts`
