import { test } from "@guardianui/test";

test.describe("Oasis Demo", () => {
    test("Should create smart DeFi account", async ({ page, gui }) => {
        // Initialize fork
        await gui.initializeChain(1);

        // Navigate to site
        await page.goto("https://oasis.app/ethereum/aave/v3/earn/wstETHeth#simulate");

        // Mocking
        await gui.setEthBalance("100000000000000000000000");

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
        await gui.validateContractInteraction("button:has-text('Create Smart DeFi account')", "0xf7b75183a2829843db06266c114297dfbfaee2b6");
    });
});
