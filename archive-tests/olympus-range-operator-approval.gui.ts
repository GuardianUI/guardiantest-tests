import { test } from "@guardianui/test";

test.describe("Olympus", () => {
    test("Should approve Operator to spend OHM", async ({ page, gui }) => {
        // Mock CoinGecko price for good measure
        page.route("https://api.coingecko.com/api/v3/simple/price?ids=olympus&vs_currencies=usd&include_24hr_change=true", async (route, request) => {
            if (request.method() === "GET") {
                const resultData = {
                    "olympus": {
                        "usd": 10.82,
                        "usd_24h_change": 0
                    }
                };

                route.fulfill({
                    contentType: "application/json",
                    body: JSON.stringify(resultData)
                });
            } else {
                route.continue();
            }
        });

        // Initialize fork
        await gui.initializeChain(1, 16643591);

        // Navigate to site
        await page.goto("https://app.olympusdao.finance/#/range");

        // Mocking
        await gui.setEthBalance("100000000000000000000000");
        await gui.setBalance("0x6b175474e89094c44da98b954eedeac495271d0f", "100000000000000000000000000");

        // Have to wait for a second for the app to process whether to interact with the bond market
        // or the operator. Otherwise the test is too fast for the react hook update.
        await page.waitForTimeout(1500);

        // Clear any info modals
        let infoModalIsVisible = await page.isVisible("text=Did You Know?");
        if (infoModalIsVisible) {
            await page.locator("[id='root']").click({ position: {x: 0, y: 0}, force: true });
        }

        // Connect wallet
        await page.waitForSelector("text=Connect Wallet");
        await page.locator("text=Connect Wallet").first().click();
        await page.waitForSelector("text=Connect Wallet");
        await page.locator("text=Connect Wallet").first().click();
        await page.locator("text=Metamask").first().click();
        await page.locator("[id='root']").click({ position: {x: 0, y: 0}, force: true });

        // Enter OHM amount
        await page.waitForSelector("input[placeholder='0']");
        await page.locator("input[placeholder='0']").first().fill("1");

        // Open modal
        await page.waitForSelector("button[data-testid='range-submit']");
        await page.locator("button[data-testid='range-submit']").first().click();

        // Submit tx
        await gui.validateContractInteraction("button:has-text('Approve DAI for Swap')", "0x1ce568dbb34b2631acdb5b453c3195ea0070ec65");
    });
});
