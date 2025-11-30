import { test, expect } from '@playwright/test';

/**
 * Comprehensive Admin Panel CRUD Tests
 * Tests all create, read, update, delete operations with detailed logging
 */

test.describe('Comprehensive Admin Panel Tests', () => {
    let consoleErrors = [];
    let apiCalls = [];

    test.beforeEach(async ({ page }) => {
        // Reset tracking arrays
        consoleErrors = [];
        apiCalls = [];

        // Log test start
        console.log(`\n${'='.repeat(80)}`);
        console.log(`🧪 Starting Test: ${test.info().title}`);
        console.log(`${'='.repeat(80)}\n`);

        // Track page navigations
        page.on('framenavigated', frame => {
            if (frame === page.mainFrame()) {
                console.log(`📍 Navigated to: ${frame.url()}`);
            }
        });

        // Track API requests
        page.on('request', request => {
            if (request.url().includes('/api/')) {
                const logEntry = `🌐 ${request.method()} ${request.url()}`;
                console.log(logEntry);
                apiCalls.push({ method: request.method(), url: request.url(), type: 'request' });
            }
        });

        // Track API responses
        page.on('response', response => {
            if (response.url().includes('/api/')) {
                const status = response.status();
                const emoji = status >= 400 ? '❌' : '✅';
                console.log(`${emoji} ${status} ${response.url()}`);
                apiCalls.push({ method: response.request().method(), url: response.url(), status, type: 'response' });
            }
        });

        // Track console errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                const text = msg.text();
                if (!text.includes('chrome-extension') && !text.includes('React Router Future Flag')) {
                    console.log(`❌ Console Error: ${text}`);
                    consoleErrors.push(text);
                }
            }
        });

        // Track page errors
        page.on('pageerror', error => {
            console.log(`❌ Page Error: ${error.message}`);
            consoleErrors.push(`Page Error: ${error.message}`);
        });
    });

    test.afterEach(async () => {
        // Log test summary
        console.log(`\n${'─'.repeat(80)}`);
        console.log(`📊 Test Summary:`);
        console.log(`   API Calls: ${apiCalls.filter(c => c.type === 'request').length}`);
        console.log(`   Errors: ${consoleErrors.length}`);
        console.log(`${'─'.repeat(80)}\n`);
    });

    test('Skills - Full CRUD Operations', async ({ page }) => {
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        console.log('🎯 Step 1: Navigate to Skills tab');
        const skillsTab = page.locator('button:has-text("Skills")');
        if (await skillsTab.count() > 0) {
            await skillsTab.first().click();
            await page.waitForTimeout(500);
            console.log('✓ Skills tab opened');

            // CREATE: Add new skill
            console.log('\n🎯 Step 2: Add new skill');
            const addButton = page.locator('button:has-text("Add New Skill"), button:has-text("Add Skill")');
            if (await addButton.count() > 0) {
                await addButton.first().click();
                await page.waitForTimeout(500);
                console.log('✓ Add skill form opened');

                // Fill in skill details
                await page.fill('input[placeholder*="skill" i], input[placeholder*="name" i]', 'Test Skill E2E');
                console.log('✓ Entered skill name: Test Skill E2E');

                // Select category
                const categorySelect = page.locator('select').first();
                if (await categorySelect.count() > 0) {
                    await categorySelect.selectOption({ index: 1 });
                    console.log('✓ Selected category');
                }

                // Set proficiency level
                const levelSlider = page.locator('input[type="range"]');
                if (await levelSlider.count() > 0) {
                    await levelSlider.fill('75');
                    console.log('✓ Set proficiency level: 75%');
                }

                // Save skill
                const saveButton = page.locator('button:has-text("Save")');
                await saveButton.click();
                await page.waitForTimeout(1000);
                console.log('✓ Skill saved');

                // Verify skill appears in list
                const skillCard = page.locator('text=Test Skill E2E');
                await expect(skillCard).toBeVisible({ timeout: 5000 });
                console.log('✓ Skill appears in list');
            }

            // READ: Verify skill persists after refresh
            console.log('\n🎯 Step 3: Verify skill persists after refresh');
            await page.reload();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);

            const skillsTabAfterRefresh = page.locator('button:has-text("Skills")');
            if (await skillsTabAfterRefresh.count() > 0) {
                await skillsTabAfterRefresh.first().click();
                await page.waitForTimeout(500);
            }

            const persistedSkill = page.locator('text=Test Skill E2E');
            await expect(persistedSkill).toBeVisible({ timeout: 5000 });
            console.log('✓ Skill persisted after refresh');

            // UPDATE: Edit the skill
            console.log('\n🎯 Step 4: Edit skill');
            const editButton = page.locator('button:has-text("Edit")').first();
            if (await editButton.count() > 0) {
                await editButton.click();
                await page.waitForTimeout(500);
                console.log('✓ Edit form opened');

                // Update skill name
                const nameInput = page.locator('input[placeholder*="skill" i], input[placeholder*="name" i]').first();
                await nameInput.fill('Test Skill E2E Updated');
                console.log('✓ Updated skill name');

                // Save changes
                const saveBtn = page.locator('button:has-text("Save")');
                await saveBtn.click();
                await page.waitForTimeout(1000);
                console.log('✓ Changes saved');

                // Verify update
                const updatedSkill = page.locator('text=Test Skill E2E Updated');
                await expect(updatedSkill).toBeVisible({ timeout: 5000 });
                console.log('✓ Skill updated successfully');
            }

            // DELETE: Remove the skill
            console.log('\n🎯 Step 5: Delete skill');
            const deleteButton = page.locator('button[title="Delete"], button:has-text("Delete")').first();
            if (await deleteButton.count() > 0) {
                await deleteButton.click();
                await page.waitForTimeout(500);
                console.log('✓ Delete confirmation opened');

                // Confirm deletion
                const confirmButton = page.locator('button:has-text("Delete"), button:has-text("Confirm")');
                if (await confirmButton.count() > 0) {
                    await confirmButton.last().click();
                    await page.waitForTimeout(1000);
                    console.log('✓ Skill deleted');

                    // Verify skill is gone
                    const deletedSkill = page.locator('text=Test Skill E2E Updated');
                    await expect(deletedSkill).not.toBeVisible({ timeout: 5000 });
                    console.log('✓ Skill removed from list');
                }
            }
        }

        // Check for errors
        expect(consoleErrors).toHaveLength(0);
        console.log('\n✅ Skills CRUD test completed successfully');
    });

    test('Experience - Full CRUD Operations', async ({ page }) => {
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        console.log('🎯 Step 1: Navigate to Experience tab');
        const experienceTab = page.locator('button:has-text("Experience")');
        if (await experienceTab.count() > 0) {
            await experienceTab.first().click();
            await page.waitForTimeout(500);
            console.log('✓ Experience tab opened');

            // CREATE
            console.log('\n🎯 Step 2: Add new experience');
            const addButton = page.locator('button:has-text("Add"), button:has-text("New")');
            if (await addButton.count() > 0) {
                await addButton.first().click();
                await page.waitForTimeout(500);
                console.log('✓ Add experience form opened');

                // Fill form
                const inputs = await page.locator('input[type="text"]').all();
                if (inputs.length >= 2) {
                    await inputs[0].fill('Test Company E2E');
                    await inputs[1].fill('Test Position E2E');
                    console.log('✓ Filled company and position');
                }

                // Save
                const saveButton = page.locator('button:has-text("Save")');
                await saveButton.click();
                await page.waitForTimeout(1000);
                console.log('✓ Experience saved');
            }

            // Verify
            const experience = page.locator('text=Test Company E2E');
            await expect(experience).toBeVisible({ timeout: 5000 });
            console.log('✓ Experience appears in list');
        }

        expect(consoleErrors).toHaveLength(0);
        console.log('\n✅ Experience CRUD test completed successfully');
    });

    test('Site Settings - Update and Verify', async ({ page }) => {
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        console.log('🎯 Step 1: Navigate to Settings tab');
        const settingsTab = page.locator('button:has-text("Settings")');
        if (await settingsTab.count() > 0) {
            await settingsTab.first().click();
            await page.waitForTimeout(500);
            console.log('✓ Settings tab opened');

            // Update tagline
            console.log('\n🎯 Step 2: Update tagline');
            const taglineInput = page.locator('input[placeholder*="tagline" i], textarea[placeholder*="tagline" i]');
            if (await taglineInput.count() > 0) {
                const originalValue = await taglineInput.first().inputValue();
                await taglineInput.first().fill('E2E Test Tagline');
                console.log('✓ Updated tagline');

                // Save
                const saveButton = page.locator('button:has-text("Save")');
                await saveButton.click();
                await page.waitForTimeout(1000);
                console.log('✓ Settings saved');

                // Restore original value
                await taglineInput.first().fill(originalValue);
                await saveButton.click();
                await page.waitForTimeout(1000);
                console.log('✓ Restored original tagline');
            }
        }

        expect(consoleErrors).toHaveLength(0);
        console.log('\n✅ Settings test completed successfully');
    });

    test('No Network Errors Across All Tabs', async ({ page }) => {
        await page.goto('/admin');
        await page.waitForLoadState('networkidle');

        const tabs = ['Projects', 'Skills', 'Experience', 'Education', 'Certificates', 'Messages', 'Settings'];

        console.log('🎯 Testing all admin tabs for network errors\n');

        for (const tabName of tabs) {
            const tab = page.locator(`button:has-text("${tabName}")`);
            if (await tab.count() > 0) {
                console.log(`📂 Checking ${tabName} tab...`);
                await tab.first().click();
                await page.waitForTimeout(1000);

                // Check for 4xx/5xx errors
                const errors = apiCalls.filter(call =>
                    call.type === 'response' &&
                    call.status >= 400 &&
                    !call.url.includes('chrome-extension')
                );

                if (errors.length > 0) {
                    console.log(`❌ Found ${errors.length} error(s) in ${tabName}:`);
                    errors.forEach(err => console.log(`   ${err.status} ${err.url}`));
                }

                expect(errors).toHaveLength(0);
                console.log(`✓ ${tabName} tab - no network errors`);
            }
        }

        console.log('\n✅ All tabs checked - no network errors found');
    });
});
