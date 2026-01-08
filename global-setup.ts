import { chromium, FullConfig } from '@playwright/test';
import * as path from 'path';

async function globalSetup(config: FullConfig) {
  const username = process.env.TRANSAX_USERNAME;
  const password = process.env.TRANSAX_PASSWORD;
  const loginUrl = process.env.TRANSAX_URL || 'https://dashboard.dev.transax.com/auth/login';

  if (!username || !password) {
    console.log('TRANSAX_USERNAME or TRANSAX_PASSWORD not set. Skipping global setup.');
    return;
  }

  console.log('Setting up authentication state for Transax...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(loginUrl);
    await page.waitForLoadState('networkidle');

    // Try to find and fill username field
    const usernameSelectors = [
      'input[name="username"]',
      'input[name="email"]',
      'input[type="text"]',
      'input[id*="user"]',
      'input[id*="email"]',
      '#username',
      '#email',
    ];

    let usernameFilled = false;
    for (const selector of usernameSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          await element.fill(username);
          usernameFilled = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!usernameFilled) {
      throw new Error('Could not find username field');
    }

    // Try to find and fill password field
    const passwordSelectors = [
      'input[name="password"]',
      'input[type="password"]',
      '#password',
    ];

    let passwordFilled = false;
    for (const selector of passwordSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          await element.fill(password);
          passwordFilled = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!passwordFilled) {
      throw new Error('Could not find password field');
    }

    // Try to find and click login button
    const loginButtonSelectors = [
      'button[type="submit"]',
      'button:has-text("Login")',
      'button:has-text("Sign in")',
      'button:has-text("Log in")',
      'input[type="submit"]',
      'button[id*="login"]',
      'button[id*="submit"]',
    ];

    let loginClicked = false;
    for (const selector of loginButtonSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          await element.click();
          loginClicked = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!loginClicked) {
      throw new Error('Could not find login button');
    }

    // Wait for navigation after login
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if login was successful
    const currentUrl = page.url();
    if (currentUrl.includes('/login') || currentUrl.includes('login')) {
      throw new Error('Login failed - still on login page');
    }

    // Save authentication state
    const authDir = path.join(__dirname, 'playwright/.auth');
    await page.context().storageState({ path: path.join(authDir, 'user.json') });
    console.log('Authentication state saved successfully!');
  } catch (error) {
    console.error('Failed to set up authentication:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
