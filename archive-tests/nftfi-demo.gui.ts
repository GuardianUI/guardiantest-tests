import { test } from "@guardianui/test";

test.describe("NFTfi Demo", () => {
    test("Should give a loan", async ({ page, gui }) => {
        // Initialize fork
        await gui.initializeChain(1, 17418001);

        // Navigate to site
        await page.goto("https://app.nftfi.com/lend/assets");

        // Mocking
        await gui.setEthBalance("100000000000000000000000");
        await gui.setBalance("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "100000000000000000000000");

        // Connect wallet
        let needToConnect = await page.isVisible(".wallet-not-connected");
        if (needToConnect) {
            await page.waitForSelector(".wallet-not-connected");
        }

        // Select pool
        await page.waitForSelector("div[class='asset listed lend']");
        await page.locator("div[class='asset listed lend']").first().click();

        // Click make offer button
        await page.waitForSelector("button[id='make-offer-button-1']");
        await page.locator("button[id='make-offer-button-1']").first().click();

        // Fill out form
        await page.waitForSelector("span[text='Set amount']");
        await page.locator("span[text='Set amount']").first().click();
        await page.locator("input[aria-label='wETH']").fill("1");
        await page.locator("span[text='Set loan duration']").first().click();
        await page.locator("div[text='Any']").first().click();
        await page.locator("text=7 days").first().click();
        await page.locator("span[text='Set APR']").first().click();
        await page.locator("input[aria-label='APR']").fill("10");

        // Confirm action
        await page.locator("button[id='make-offer-button-2']").first().click();
    });
});