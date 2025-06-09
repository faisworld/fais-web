#!/usr/bin/env node

/**
 * ElevenLabs Widget Functionality Test
 * Tests the current widget implementation for proper functionality
 */

const puppeteer = require('puppeteer');

async function testWidgetFunctionality() {
    console.log('🚀 Starting ElevenLabs Widget Functionality Test...\n');

    let browser;
    let testResults = {
        widgetLoaded: false,
        formValidation: false,
        scriptErrors: [],
        consoleWarnings: [],
        widgetInteractive: false
    };

    try {
        // Launch browser
        browser = await puppeteer.launch({ 
            headless: false,  // Show browser for manual testing
            devtools: true,   // Open DevTools
            args: [
                '--disable-web-security',
                '--allow-running-insecure-content',
                '--disable-features=VizDisplayCompositor'
            ]
        });

        const page = await browser.newPage();
        
        // Listen for console messages
        page.on('console', (msg) => {
            const text = msg.text();
            if (msg.type() === 'error') {
                testResults.scriptErrors.push(text);
                console.log(`❌ Console Error: ${text}`);
            } else if (msg.type() === 'warning') {
                testResults.consoleWarnings.push(text);
                console.log(`⚠️  Console Warning: ${text}`);
            }
        });

        // Listen for network errors
        page.on('requestfailed', (request) => {
            console.log(`🌐 Network Error: ${request.failure().errorText} - ${request.url()}`);
        });

        console.log('📱 Opening local development server...');
        await page.goto('http://localhost:3000', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });

        // Wait for page to fully load
        await page.waitForTimeout(3000);

        console.log('🔍 Checking for ElevenLabs widget...');

        // Check if widget container exists
        const widgetContainer = await page.$('elevenlabs-convai');
        if (widgetContainer) {
            testResults.widgetLoaded = true;
            console.log('✅ ElevenLabs widget element found');
        } else {
            console.log('❌ ElevenLabs widget element not found');
        }

        // Check if widget script loaded
        const widgetScript = await page.$('script[src*="elevenlabs"]');
        if (widgetScript) {
            console.log('✅ ElevenLabs script loaded');
        } else {
            console.log('❌ ElevenLabs script not found');
        }

        // Check for form validation issues
        console.log('🔍 Checking form validation...');
        
        // Look for inputs without id or name attributes
        const invalidInputs = await page.evaluate(() => {
            const inputs = document.querySelectorAll('input');
            const invalid = [];
            inputs.forEach((input, index) => {
                if (!input.id && !input.name) {
                    invalid.push({
                        index,
                        type: input.type,
                        value: input.value,
                        tagName: input.tagName
                    });
                }
            });
            return invalid;
        });

        if (invalidInputs.length === 0) {
            testResults.formValidation = true;
            console.log('✅ No form validation issues found');
        } else {
            console.log(`❌ Found ${invalidInputs.length} inputs without proper id/name attributes:`);
            invalidInputs.forEach((input, i) => {
                console.log(`   ${i + 1}. ${input.tagName} type="${input.type}"`);
            });
        }

        // Test widget interaction (manual step)
        console.log('\n🎤 MANUAL TEST REQUIRED:');
        console.log('1. Look for the ElevenLabs widget on the page');
        console.log('2. Try to interact with it (click to start voice chat)');
        console.log('3. Speak into your microphone');
        console.log('4. Check if the widget responds back');
        console.log('\nBrowser will stay open for 60 seconds for manual testing...');

        // Wait for manual testing
        await page.waitForTimeout(60000);

        // Final widget check
        const finalWidgetCheck = await page.evaluate(() => {
            const widget = document.querySelector('elevenlabs-convai');
            return {
                exists: !!widget,
                hasAttributes: widget ? Object.keys(widget.attributes).length > 0 : false,
                isVisible: widget ? widget.offsetParent !== null : false
            };
        });

        console.log('\n📊 FINAL TEST RESULTS:');
        console.log('=' * 50);
        console.log(`Widget Loaded: ${testResults.widgetLoaded ? '✅' : '❌'}`);
        console.log(`Widget Visible: ${finalWidgetCheck.isVisible ? '✅' : '❌'}`);
        console.log(`Form Validation: ${testResults.formValidation ? '✅' : '❌'}`);
        console.log(`Script Errors: ${testResults.scriptErrors.length === 0 ? '✅' : '❌'} (${testResults.scriptErrors.length} errors)`);
        console.log(`Console Warnings: ${testResults.consoleWarnings.length} warnings`);

        if (testResults.scriptErrors.length > 0) {
            console.log('\n🚨 Script Errors:');
            testResults.scriptErrors.forEach((error, i) => {
                console.log(`   ${i + 1}. ${error}`);
            });
        }

        if (testResults.consoleWarnings.length > 0 && testResults.consoleWarnings.length < 10) {
            console.log('\n⚠️  Console Warnings:');
            testResults.consoleWarnings.forEach((warning, i) => {
                console.log(`   ${i + 1}. ${warning}`);
            });
        }

    } catch (error) {
        console.error('🚨 Test failed with error:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Check if development server is running
async function checkDevServer() {
    try {
        const response = await fetch('http://localhost:3000');
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Main execution
async function main() {
    const serverRunning = await checkDevServer();
    
    if (!serverRunning) {
        console.log('❌ Development server is not running at http://localhost:3000');
        console.log('Please start the dev server with: npm run dev');
        process.exit(1);
    }

    await testWidgetFunctionality();
}

if (require.main === module) {
    main().catch(console.error);
}
