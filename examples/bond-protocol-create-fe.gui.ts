import { test } from "@guardianui/test";

test.describe("Bond Protocol", () => {
    test("Should create Fixed Expiry market", async ({ page, gui }) => {
        // Initialize fork
        await gui.initializeChain(1);

        // Go to bond protocol
        await page.goto("https://app.bondprotocol.finance/#/create");

        // Mocking
        await gui.setEthBalance("100000000000000000000000");
        await gui.setAllowance("0x6b175474e89094c44da98b954eedeac495271d0f", "0x007FE70dc9797C4198528aE43d8195ffF82Bdc95", "100000000000000000000000");
        await gui.setBalance("0x6b175474e89094c44da98b954eedeac495271d0f", "100000000000000000000000");

        // Select DAI as payout token
        await page.waitForSelector("input[id='cm-payout-token-picker']");
        await page.locator("input[id='cm-payout-token-picker']").first().click();
        await page.waitForSelector("text=DAI");
        await page.locator("text=DAI").first().click();

        // Select DAI as output token
        await page.waitForSelector("input[id='cm-quote-token-picker']");
        await page.locator("input[id='cm-quote-token-picker']").first().click();
        await page.waitForSelector("text=DAI");
        await page.locator("text=DAI").first().click();

        // Select vesting term
        await page.waitForSelector("button[id='cm-vesting-picker']");
        await page.locator("button[id='cm-vesting-picker']").first().click();
        await page.waitForSelector("text=Custom");
        await page.locator("text=Custom").first().click();
        await page.waitForSelector("div[role='presentation'] >> button >> nth=1");
        await page.locator("div[role='presentation'] >> button >> nth=1").first().click();
        await page.locator("button[name='day'] >> nth=-1").click();
        await page.locator("button:has-text('Select')").first().click();

        // Enter capacity
        await page.waitForSelector("input[id='cm-capacity-picker']");
        await page.locator("input[id='cm-capacity-picker']").first().fill("100");

        // Select end date
        await page.waitForSelector("input[id='cm-end-date-picker']");
        await page.locator("input[id='cm-end-date-picker']").first().click();
        await page.waitForSelector("[placeholder='Enter the amount of days to run the market']");
        await page.waitForTimeout(1500); // something resets the input state shortly after loading the modal, so we need to wait a bit
        await page.locator("[placeholder='Enter the amount of days to run the market']").first().fill("10");
        await page.locator("button[id='end-date-select-button']").first().click();

        // Open market submission modal
        await page.waitForSelector("button[id='cm-pre-submit']");
        await page.locator("button[id='cm-pre-submit']").first().click();

        // Confirm deployment
        await page.waitForSelector("button[id='cm-confirm-modal-submit']");
        await gui.validateContractInteraction("button[id='cm-confirm-modal-submit']", "0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD");
    });
});
