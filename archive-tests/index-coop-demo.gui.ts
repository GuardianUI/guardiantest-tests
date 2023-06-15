import { test } from "@guardianui/test";

test.describe("Index_Coop", () => {
    test("Should swap ETH to dsETH", async ({ page, gui }) => {
        await page.waitForTimeout(2500);

        // Initialize fork
        await gui.initializeChain(1);

        // Navigate to site
        await page.goto("https://app.indexcoop.com/swap");

        // Set up wallet
        await gui.setEthBalance("100000000000000000000000");
       
        // Connect wallet
        await page.waitForSelector("text=Connect");
        await page.locator("text=Connect").first().click();
        await page.waitForSelector("text=MetaMask");
        await page.locator("text=MetaMask").click();

        // Confirm wallet connection
        await page.waitForSelector("button[data-testid='rk-account-button']");

        // Enter ETH amount
        await page.locator("input[placeholder='0.0']").first().fill("0.1");

        // Submit swap transaction
        await gui.validateContractInteraction("button:has-text('Trade')", "0xDef1C0ded9bec7F1a1670819833240f027b25EfF");
      });
});
