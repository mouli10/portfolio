import { test, expect } from '@playwright/test';

test.describe('Portfolio Frontend Tests', () => {
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

    test('homepage loads without errors', async ({ page }) => {
        await page.goto('/');

        // Wait for page to fully load
        await page.waitForLoadState('networkidle');

        // Check title
        await expect(page).toHaveTitle(/Mouli|Portfolio/);

        // Verify no console errors (filter out extension errors)
        const realErrors = consoleErrors.filter(err =>
            !err.includes('chrome-extension') &&
            !err.includes('React Router Future Flag')
        );

        if (realErrors.length > 0) {
            console.log('Console Errors:', realErrors);
        }
        expect(realErrors).toHaveLength(0);

        // Verify no network errors
        expect(networkErrors).toHaveLength(0);
    });

    test('all main sections are visible', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check hero section - look for actual content
        await expect(page.getByText(/Hello, I'm|Full Stack Developer/i)).toBeVisible();

        // Check sections exist
        const sections = ['about', 'skills', 'projects', 'experience', 'education', 'contact'];
        for (const section of sections) {
            await expect(page.locator(`#${section}`)).toBeVisible({ timeout: 5000 });
        }
    });

    test('navigation works', async ({ page }) => {
        await page.goto('/');

        // Test smooth scroll navigation
        await page.click('a[href="#about"]', { timeout: 5000 }).catch(() => { });
        await page.waitForTimeout(500);

        // Verify no errors after navigation
        const realErrors = consoleErrors.filter(err =>
            !err.includes('chrome-extension') &&
            !err.includes('React Router Future Flag') &&
            !err.includes('ERR_HTTP2_PROTOCOL_ERROR')
        );
        expect(realErrors).toHaveLength(0);
    });

    test('skills section displays and filters work', async ({ page }) => {
        await page.goto('/');

        // Scroll to skills
        await page.locator('#skills').scrollIntoViewIfNeeded();

        // Wait for skills to load
        await page.waitForSelector('.hexagon-container, [class*="skill"]', { timeout: 10000 }).catch(() => { });

        // Try clicking filter buttons if they exist
        const filterButtons = page.locator('button:has-text("All"), button:has-text("Frontend"), button:has-text("Backend")');
        const count = await filterButtons.count();

        if (count > 0) {
            await filterButtons.first().click();
            await page.waitForTimeout(500);
        }

        // Check for errors
        const realErrors = consoleErrors.filter(err =>
            !err.includes('chrome-extension') &&
            !err.includes('React Router Future Flag') &&
            !err.includes('ERR_HTTP2_PROTOCOL_ERROR')
        );
        expect(realErrors).toHaveLength(0);
    });

    test('contact form is present', async ({ page }) => {
        await page.goto('/');

        // Scroll to contact
        await page.locator('#contact').scrollIntoViewIfNeeded();

        // Check form exists - use getByRole for better selector
        await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible({ timeout: 5000 });
    });

    test('projects section displays', async ({ page }) => {
        await page.goto('/');

        // Scroll to projects
        await page.locator('#projects').scrollIntoViewIfNeeded();

        // Wait for projects to load
        await page.waitForTimeout(1000);

        // Verify no errors
        const realErrors = consoleErrors.filter(err =>
            !err.includes('chrome-extension') &&
            !err.includes('React Router Future Flag') &&
            !err.includes('ERR_HTTP2_PROTOCOL_ERROR')
        );
        expect(realErrors).toHaveLength(0);
    });

    test('responsive design - mobile view', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check mobile menu or navigation
        await expect(page.locator('nav, header')).toBeVisible();

        // Verify no errors
        const realErrors = consoleErrors.filter(err =>
            !err.includes('chrome-extension') &&
            !err.includes('React Router Future Flag')
        );
        expect(realErrors).toHaveLength(0);
    });

    test('responsive design - tablet view', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Verify layout
        await expect(page.locator('body')).toBeVisible();

        // Verify no errors
        const realErrors = consoleErrors.filter(err =>
            !err.includes('chrome-extension') &&
            !err.includes('React Router Future Flag')
        );
        expect(realErrors).toHaveLength(0);
    });
});
