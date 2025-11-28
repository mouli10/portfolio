import { test, expect } from '@playwright/test';

test.describe('Admin Panel Tests', () => {
    let consoleErrors = [];
    let networkErrors = [];

    test.beforeEach(async ({ page }) => {
        // Capture console errors
        consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        // Capture network errors
        networkErrors = [];
        page.on('response', response => {
            if (response.status() >= 400) {
                networkErrors.push({
                    url: response.url(),
                    status: response.status()
                });
            }
        });

        // Capture page errors
        page.on('pageerror', error => {
            consoleErrors.push(`Page Error: ${error.message}`);
        });
    });

    test('admin panel loads', async ({ page }) => {
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        // Should show login or dashboard
        await expect(page.locator('h1, h2').first()).toBeVisible();

        // Check for errors
        const realErrors = consoleErrors.filter(err =>
            !err.includes('chrome-extension') &&
            !err.includes('React Router Future Flag')
        );

        if (realErrors.length > 0) {
            console.log('Admin Panel Console Errors:', realErrors);
        }
        expect(realErrors).toHaveLength(0);
        expect(networkErrors.filter(e => !e.url.includes('chrome-extension'))).toHaveLength(0);
    });

    test('admin tabs are accessible', async ({ page }) => {
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        // Wait a bit for any dynamic content
        await page.waitForTimeout(1000);

        // Look for tab buttons
        const tabs = [
            'Projects', 'Skills', 'Experience', 'Education',
            'Certificates', 'Messages', 'Settings'
        ];

        for (const tab of tabs) {
            const tabButton = page.locator(`button:has-text("${tab}")`);
            const count = await tabButton.count();

            if (count > 0) {
                await tabButton.first().click();
                await page.waitForTimeout(500);

                // Check for errors after clicking
                const realErrors = consoleErrors.filter(err =>
                    !err.includes('chrome-extension') &&
                    !err.includes('React Router Future Flag')
                );

                if (realErrors.length > 0) {
                    console.log(`Errors in ${tab} tab:`, realErrors);
                    expect(realErrors).toHaveLength(0);
                }
            }
        }
    });

    test('skill categories panel works', async ({ page }) => {
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        // Click on Skills tab
        const skillsTab = page.locator('button:has-text("Skills")');
        if (await skillsTab.count() > 0) {
            await skillsTab.first().click();
            await page.waitForTimeout(500);

            // Look for categories button/tab
            const categoriesButton = page.locator('button:has-text("Categories"), button:has-text("Skill Categories")');
            if (await categoriesButton.count() > 0) {
                await categoriesButton.first().click();
                await page.waitForTimeout(500);
            }

            // Check for errors
            const realErrors = consoleErrors.filter(err =>
                !err.includes('chrome-extension') &&
                !err.includes('React Router Future Flag')
            );
            expect(realErrors).toHaveLength(0);
        }
    });

    test('no 404 errors on admin panel', async ({ page }) => {
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        // Wait for any API calls to complete
        await page.waitForTimeout(2000);

        // Check for 404 errors
        const notFoundErrors = networkErrors.filter(e =>
            e.status === 404 && !e.url.includes('chrome-extension')
        );

        if (notFoundErrors.length > 0) {
            console.log('404 Errors:', notFoundErrors);
        }
        expect(notFoundErrors).toHaveLength(0);
    });

    test('no 500 errors on admin panel', async ({ page }) => {
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        // Wait for any API calls to complete
        await page.waitForTimeout(2000);

        // Check for 500 errors
        const serverErrors = networkErrors.filter(e =>
            e.status >= 500 && !e.url.includes('chrome-extension')
        );

        if (serverErrors.length > 0) {
            console.log('Server Errors:', serverErrors);
        }
        expect(serverErrors).toHaveLength(0);
    });
});
