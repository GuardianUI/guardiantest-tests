import { test } from "@guardianui/test";

test.describe("JonesDAO", () => {
    test("Should deposit AURA into jAURA vault", async ({ page, gui }) => {
        // Initialize fork
        await gui.initializeChain(1);

        // Navigate to site
        await page.goto("https://app.jonesdao.io/vaults/aura");

        // Set up wallet
        const auraToken = "0xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF";
        const depositContract = "0xf01dd67ed9006f13f79ba9de1a370864ad92b449";
        await gui.setEthBalance("100000000000000000000000");
        await gui.setAllowance(auraToken, depositContract, "1000000000000000000000000");
        await gui.setBalance(auraToken, "1000000000000000000000000");

        // Dismiss ToS modal
        await page.locator("input[name='apy']").check();
        await page.locator("input[name='risk']").check();
        await page.locator("input[name='ui']").check();
        await page.locator("input[name='countries']").check();
        await page.getByRole('button', { name: 'Accept Terms' }).click();

        // Enter input amount
        await page.getByRole('complementary').getByPlaceholder('0.00').click();
        await page.getByRole('complementary').getByPlaceholder('0.00').fill("0.1");

        // Select vault
        await page.getByLabel('jAURA', { exact: true }).check();

        // Approve
        await page.getByRole('button', { name: 'Approve' }).click();

        // Execute
        await page.getByRole('button', { name: 'Deposit' }).click();

        // Submit stake transaction
        await gui.validateContractInteraction("[label='Deposit']", depositContract);
    });
});
