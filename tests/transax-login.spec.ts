import { test, expect } from '@playwright/test';

test('Login to Transax', async ({ page }) => {
  // Step 1: Get login credentials from environment variables
  const username = process.env.TRANSAX_USERNAME || 'qamanualtesting.admin@gmail.com';
  const password = process.env.TRANSAX_PASSWORD || 'Qatest111!';
  const loginUrl = process.env.TRANSAX_URL || 'https://dashboard.dev.transax.com/auth/login';

  // Step 2: Go to the login page
  await page.goto(loginUrl);

  // Step 3: Wait for the page to load completely
  await page.waitForLoadState('networkidle');

  // Step 4: Fill in the email/username field
  // Find the email input field and type the username
  await page.fill('input[type="text"]', username);

  // Step 5: Fill in the password field
  // Find the password input field and type the password
  await page.fill('input[type="password"]', password);

  // Step 6: Click the login button
  // Find and click the submit button
  await page.click('button[type="submit"]');

  // Step 7: Wait for the page to navigate after login
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Wait 3 seconds for any redirects

  // Step 8: Check if login was successful
  // If we're no longer on the login page, login was successful
  const currentUrl = page.url();
  
  // Verify we're not on the login page anymore
  expect(currentUrl).not.toContain('/login');
  expect(currentUrl).not.toContain('/auth/login');
  
  console.log('Login successful!');
  console.log('Current URL:', currentUrl);
});
