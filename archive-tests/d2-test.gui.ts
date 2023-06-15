import { test } from "@guardianui/test";

const isTokenBalanceAPI = (url: URL) => {
    if (url.hostname === "app.d2.finance" && url.pathname.includes("/api/user/tokenBalance")) {
        return true;
    }

    return false;
}

test.describe("D-Squared", () => {
    test("Should mock balances", async ({ page, gui }) => {
        // Initialize fork
        await gui.initializeChain(42161);

        // Mock api balance checks
        page.route(isTokenBalanceAPI, async (route, request) => {
            console.log("Mocking token balance API");
            if (request.method() === "GET") {
                if (request.url().includes("tokenName=DSQ")) {
                    const resultData = {
                        "balance":"10000.0"
                    };

                    route.fulfill({
                        contentType: "application/json",
                        body: JSON.stringify(resultData)
                    });
                } else {
                    route.continue();
                }
            } else {
                route.continue();
            }
        });

        // Go to d2
        await page.goto("https://app.d2.finance/earn");

        // Mocking
        await gui.setEthBalance("100000000000000000000000");
        await gui.setBalance("0xdb0c6fc9e01cd95eb1d3bbae6689962de489cd7b", "10000000000000000000000");

        // Connect wallet
        await page.waitForSelector("button[data-testid='connect-wallet']");
        await page.locator("button[data-testid='connect-wallet']").first().click();
        await page.waitForSelector("text=Metamask");
        await page.locator("text=Metamask").first().click();

        // Accept terms
        await page.waitForSelector("div[data-testid='accept-terms']");
        await page.locator("div[data-testid='accept-terms']").first().click();
        await page.waitForSelector("button:has-text('Confirm')");
        await page.locator("button:has-text('Confirm')").first().click();

        // Open staking modal
        await page.waitForSelector("button[data-testid='stake-dsq']");
        await page.locator("button[data-testid='stake-dsq']").first().click();

        // Enter stake amount
        await page.waitForSelector("input[data-testid='stake-amount']");
        await page.locator("input[data-testid='stake-amount']").first().fill("1");

        // Click approve
        await page.waitForSelector("button[data-testid='stake-submit']");
        await gui.validateContractInteraction("button[data-testid='stake-submit']", "0x0fecacd06304cde4b3b94073f71a52faff8d5410");
    });
});
