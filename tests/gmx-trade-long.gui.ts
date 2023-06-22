import { test } from '@guardianui/test';

test.describe("GMX", () => {
  test('Long ETH', async ({ page, gui }) => {
    // Initialize fork
    await gui.initializeChain(42161, 17537124);

    // Navigate to site
    await page.goto('https://app.gmx.io/#/dashboard');

    // Set up wallet
    await gui.setEthBalance('100000000000000000000000');

    // Navigate to the trade page
    await page.getByRole('link', { name: 'Trade' }).click();

    // Connect wallet
    await page.locator("text=Connect Wallet").first().click();
    await page.waitForSelector("text=Connect Wallet");
    await page.locator("text=MetaMask").first().click();
    await page.locator("[id='root']").click({ position: { x: 0, y: 0 }, force: true });

    // Set the values
    await page.getByText('PayBalanceETH').click();
    await page.locator('div').filter({ hasText: /^PayBalanceETH$/ }).getByPlaceholder('0.0').fill('1');

    await page.getByPlaceholder('0.0').nth(1).click();
    await page.getByPlaceholder('0.0').nth(1).fill('2');

    // Execute
    await page.getByText('Enable Leverage').click();

    // Validate contract
    await gui.validateContractInteraction(`button:near(:text("Enable Leverage"))`, "0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064");
  });
});
