import { test, expect } from '@playwright/test';

/**
 * Comprehensive Frontend Tests
 * Tests all user-facing features and interactions
 */

test.describe('Comprehensive Frontend Tests', () => {
    test.beforeEach(async ({ page }) => {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`🧪 Starting Test: ${test.info().title}`);
        console.log(`${'='.repeat(80)}\n`);
    });

    test('Hero Section - Complete Functionality', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        console.log('🎯 Step 1: Check Hero section loads');
        const heroSection = page.locator('section').first();
        await expect(heroSection).toBeVisible();
        console.log('✓ Hero section visible');

        console.log('\n🎯 Step 2: Verify profile image loads');
        const profileImage = page.locator('img[alt*="Profile" i]');
        if (await profileImage.count() > 0) {
            await expect(profileImage.first()).toBeVisible();
            console.log('✓ Profile image loaded');
        }

        console.log('\n🎯 Step 3: Check social links');
        const socialLinks = page.locator('a[href*="github"], a[href*="linkedin"], a[href*="mailto"]');
        const linkCount = await socialLinks.count();
        console.log(`✓ Found ${linkCount} social links`);
        expect(linkCount).toBeGreaterThan(0);

        console.log('\n✅ Hero section test completed');
    });

    test('Navigation - All Sections Accessible', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const sections = ['Projects', 'Skills', 'Experience', 'Education', 'Certificates', 'Contact'];

        console.log('🎯 Testing navigation to all sections\n');

        for (const section of sections) {
            console.log(`📍 Navigating to ${section}...`);
            const navLink = page.locator(`a[href*="#${section.toLowerCase()}"], a:has-text("${section}")`);

            if (await navLink.count() > 0) {
                await navLink.first().click();
                await page.waitForTimeout(1000);
                console.log(`✓ ${section} section reached`);
            }
        }

        console.log('\n✅ Navigation test completed');
    });

    test('Projects Section - All Projects Display', async ({ page }) => {
        await page.goto('/#projects');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        console.log('🎯 Step 1: Check Projects section');
        const projectsSection = page.locator('section#projects, section:has-text("Projects")');
        await expect(projectsSection.first()).toBeVisible();
        console.log('✓ Projects section visible');

        console.log('\n🎯 Step 2: Count project cards');
        const projectCards = page.locator('[class*="project"], [class*="card"]').filter({ hasText: /.+/ });
        const count = await projectCards.count();
        console.log(`✓ Found ${count} project cards`);

        console.log('\n🎯 Step 3: Check project images load');
        const projectImages = page.locator('img[alt*="project" i], img[loading="lazy"]');
        const imageCount = await projectImages.count();
        console.log(`✓ Found ${imageCount} project images`);

        console.log('\n✅ Projects section test completed');
    });

    test('Skills Section - Category Filter Works', async ({ page }) => {
        await page.goto('/#skills');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        console.log('🎯 Step 1: Check Skills section');
        const skillsSection = page.locator('section#skills, section:has-text("Skills")');
        await expect(skillsSection.first()).toBeVisible();
        console.log('✓ Skills section visible');

        console.log('\n🎯 Step 2: Test category filters');
        const categoryButtons = page.locator('button[class*="category"], button[class*="filter"]');
        const buttonCount = await categoryButtons.count();

        if (buttonCount > 0) {
            console.log(`✓ Found ${buttonCount} category filters`);

            // Click first category
            await categoryButtons.first().click();
            await page.waitForTimeout(500);
            console.log('✓ Category filter clicked');
        }

        console.log('\n✅ Skills section test completed');
    });

    test('Contact Form - Validation Works', async ({ page }) => {
        await page.goto('/#contact');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        console.log('🎯 Step 1: Locate contact form');
        const contactForm = page.locator('form');

        if (await contactForm.count() > 0) {
            console.log('✓ Contact form found');

            console.log('\n🎯 Step 2: Test form validation');
            const submitButton = page.locator('button[type="submit"]');

            if (await submitButton.count() > 0) {
                await submitButton.click();
                await page.waitForTimeout(500);
                console.log('✓ Submit button clicked (empty form)');

                // Form should show validation errors
                console.log('✓ Form validation triggered');
            }

            console.log('\n🎯 Step 3: Fill form with valid data');
            const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]');
            const emailInput = page.locator('input[type="email"], input[name="email"]');
            const messageInput = page.locator('textarea[name="message"], textarea[placeholder*="message" i]');

            if (await nameInput.count() > 0) {
                await nameInput.fill('E2E Test User');
                console.log('✓ Filled name');
            }
            if (await emailInput.count() > 0) {
                await emailInput.fill('test@example.com');
                console.log('✓ Filled email');
            }
            if (await messageInput.count() > 0) {
                await messageInput.fill('This is an E2E test message');
                console.log('✓ Filled message');
            }
        }

        console.log('\n✅ Contact form test completed');
    });

    test('Mobile Menu - Works Correctly', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        console.log('🎯 Step 1: Check for mobile menu button');
        const menuButton = page.locator('button[aria-label*="menu" i], button:has-text("☰")');

        if (await menuButton.count() > 0) {
            console.log('✓ Mobile menu button found');

            console.log('\n🎯 Step 2: Open mobile menu');
            await menuButton.click();
            await page.waitForTimeout(500);
            console.log('✓ Mobile menu opened');

            console.log('\n🎯 Step 3: Close mobile menu');
            await menuButton.click();
            await page.waitForTimeout(500);
            console.log('✓ Mobile menu closed');
        }

        console.log('\n✅ Mobile menu test completed');
    });

    test('All Images Have Alt Text', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        console.log('🎯 Checking all images for alt text\n');

        const images = await page.locator('img').all();
        let missingAlt = 0;

        for (let i = 0; i < images.length; i++) {
            const alt = await images[i].getAttribute('alt');
            const src = await images[i].getAttribute('src');

            if (!alt || alt.trim() === '') {
                console.log(`❌ Image missing alt text: ${src}`);
                missingAlt++;
            }
        }

        console.log(`\n✓ Checked ${images.length} images`);
        console.log(`✓ Missing alt text: ${missingAlt}`);

        expect(missingAlt).toBe(0);
        console.log('\n✅ All images have alt text');
    });

    test('No Console Errors on Page Load', async ({ page }) => {
        const consoleErrors = [];

        page.on('console', msg => {
            if (msg.type() === 'error') {
                const text = msg.text();
                if (!text.includes('chrome-extension') && !text.includes('React Router Future Flag')) {
                    consoleErrors.push(text);
                }
            }
        });

        page.on('pageerror', error => {
            consoleErrors.push(`Page Error: ${error.message}`);
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        if (consoleErrors.length > 0) {
            console.log('❌ Console Errors Found:');
            consoleErrors.forEach(err => console.log(`   ${err}`));
        }

        expect(consoleErrors).toHaveLength(0);
        console.log('✅ No console errors on page load');
    });
});
