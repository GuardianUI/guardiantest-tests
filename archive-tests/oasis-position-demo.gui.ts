import { test } from "@guardianui/test";

test.describe("Oasis Demo", () => {
    test.use({ actionTimeout: 120000 });

    test("Should create smart DeFi account and create a position", async ({ page, gui }) => {
        await page.waitForTimeout(2500);

        page.route("https://oasis.app/api/gasPrice", async (route, request) => {
            if (request.method() === "GET") {
                const resultData = {
                    "time": 1686333123013,
                    "fromCache": true,
                    "maxPriorityFeePerGas": 5,
                    "maxFeePerGas":50
                }

                route.fulfill({
                    contentType: "application/json",
                    body: JSON.stringify(resultData)
                });
            } else {
                route.continue();
            }
        });

        page.route("http://127.0.0.1:8545", async (route, request) => {
            if (request.method() === "POST") {
                const data = JSON.parse(request.postData());

                if (data.method === "eth_estimateGas") {
                    const resultData = {
                        "jsonrpc": "2.0",
                        "id": data.id,
                        "result": "0x989680"
                    }

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

        // Initialize fork
        await gui.initializeChain(1, 17444453);

        // Navigate to site
        await page.goto("https://oasis.app/ethereum/aave/v3/earn/wstETHeth#simulate");

        // Mocking
        await gui.setEthBalance("100000000000000000000000");
        const wallet = await gui.getWalletAddress();
        const ethBalance = await gui.getEthBalance(wallet);
        console.log("ethBalance", ethBalance);

        // Connect wallet
        await page.waitForSelector("text=Connect Wallet");
        await page.locator("text=Connect Wallet").first().click();
        await page.locator(".name >> text=MetaMask").first().click();

        // Wait for connection modal to not be visible
        await page.waitForSelector("text=Connection Successful");
        await page.waitForSelector("text=Connection Successful", { state: "hidden" });

        // If sign message popup appears, click it
        let popupIsVisible = await page.isVisible("text=Sign message");
        if (popupIsVisible) {
            await page.locator("text=Sign message").click();
            await page.waitForSelector("text=Welcome", { state: "hidden" });
            await page.waitForSelector("text=I have read and accept the Terms of Service.");
            await page.locator("text=I have read and accept the Terms of Service.").click();
            await page.locator("button:has-text('Continue')").click();
        }

        // Click create account
        await page.waitForSelector("button:has-text('Create Smart DeFi account')");
        await page.locator("button:has-text('Create Smart DeFi account')").first().click();

        // Confirm action
        await page.waitForSelector("button:has-text('Create Smart DeFi account')");
        await page.locator("button:has-text('Create Smart DeFi account')").first().click();

        // Move to next step for deposit
        await page.waitForSelector("button:has-text('Continue')");
        await page.locator("button:has-text('Continue')").first().click();

        // Enter ETH amount
        await page.locator("input[placeholder='0 ETH']").first().fill("1");

        // Confirm action
        await page.waitForSelector("button:has-text('Open Earn position')");
        await page.locator("button:has-text('Open Earn position')").first().click();
        await page.waitForSelector("button:has-text('Confirm')");
        await gui.validateContractInteraction("button:has-text('Confirm')", "0x184045c22A414310Cbec1BF1061A3104985297ec");
    });
});
