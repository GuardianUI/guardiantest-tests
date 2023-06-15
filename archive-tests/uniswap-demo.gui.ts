import { test } from "@guardianui/test";

test.describe("Swap", () => {
    test("Starts with ETH selected by default", async ({ page }) => {
        // Navigate to page
        await page.goto("https://app.uniswap.org/#/swap");

        await test.expect(page.locator("#swap-currency-input .token-amount-input")).toHaveValue("");
        await test.expect(page.locator("#swap-currency-input .token-symbol-container")).toHaveText("ETH");
        await test.expect(page.locator("#swap-currency-output .token-symbol-container")).toHaveText("Select token");
    });

    test("Should default inputs from URL params", async ({ page }) => {
        await page.goto("https://app.uniswap.org/#/swap?inputCurrency=0x1f9840a85d5af5bf1d1762f925bdaddc4201f984");
        await test.expect(page.locator("#swap-currency-input .token-symbol-container")).toHaveText("UNI");
        await test.expect(page.locator("#swap-currency-output .token-symbol-container")).toHaveText("Select token");

        await page.goto("https://app.uniswap.org/#/swap?outputCurrency=0x1f9840a85d5af5bf1d1762f925bdaddc4201f984");
        await test.expect(page.locator("#swap-currency-input .token-symbol-container")).toHaveText("Select token");
        await test.expect(page.locator("#swap-currency-output .token-symbol-container")).toHaveText("UNI");

        await page.goto("https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x1f9840a85d5af5bf1d1762f925bdaddc4201f984");
        await test.expect(page.locator("#swap-currency-input .token-symbol-container")).toHaveText("ETH");
        await test.expect(page.locator("#swap-currency-output .token-symbol-container")).toHaveText("UNI");
    });

    test("Should reset inputs when navigating between pages", async ({ page}) => {
        await page.goto("https://app.uniswap.org/#/swap");
        await test.expect(page.locator("#swap-currency-input .token-amount-input")).toHaveValue("");
        await page.locator("#swap-currency-input .token-amount-input").first().fill("1");
        await test.expect(page.locator("#swap-currency-input .token-amount-input")).toHaveValue("1");

        await page.goto("https://app.uniswap.org/#/pool");
        await page.goto("https://app.uniswap.org/#/swap");
        await test.expect(page.locator("#swap-currency-input .token-amount-input")).toHaveValue("");
    });

    test("Should swap ETH for USDC", async ({ page, gui }) => {
        // Initialize fork
        await gui.initializeChain(1, 17387626);

        // Navigate to site
        await page.goto("https://app.uniswap.org/#/swap");

        // Get wallet address
        const walletAddress = await gui.getWalletAddress();

        // Mock quote api
        page.route("https://api.uniswap.org/v2/quote", async (route, request) => {
            console.log("Request method: " + request.method());
            console.log(request.postData());
        });

        page.route("https://api.uniswap.org/v1/quote?protocols=v2%2Cv3%2Cmixed&tokenInAddress=ETH&tokenInChainId=1&tokenOutAddress=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&tokenOutChainId=1&amount=1000000000000000000&type=exactIn", async (route, request) => {
            if (request.method() === "GET") {
                const resultData = {
                    "blockNumber": "17387626",
                    "amount": "1000000000000000000",
                    "amountDecimals": "1",
                    "quote": "1875204936",
                    "quoteDecimals": "1875.204936",
                    "quoteGasAdjusted": "1866873768",
                    "quoteGasAdjustedDecimals": "1866.873768",
                    "gasUseEstimateQuote": "8331167",
                    "gasUseEstimateQuoteDecimals": "8.331167",
                    "gasUseEstimate": "113000",
                    "gasUseEstimateUSD": "8.331167",
                    "simulationStatus": "UNATTEMPTED",
                    "simulationError": false,
                    "gasPriceWei": "39403983712",
                    "route":[
                        [
                            {
                                "type": "v3-pool",
                                "address": walletAddress,
                                "tokenIn":{
                                    "chainId": 1,
                                    "decimals": "18",
                                    "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
                                    "symbol": "WETH"
                                },
                                "tokenOut":{
                                    "chainId": 1,
                                    "decimals": "6",
                                    "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                                    "symbol": "USDC"
                                },
                                "fee": "500",
                                "liquidity": "28631266011226059305",
                                "sqrtRatioX96": "1829143877789014926160438301298223",
                                "tickCurrent": "200950",
                                "amountIn": "1000000000000000000",
                                "amountOut": "1875204936"
                            }
                        ]
                    ],
                    "routeString": "[V3] 100.00% = WETH -- 0.05% [0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640] --> USDC",
                    "quoteId": "25ae8"
                };

                route.fulfill({
                    contentType: "application/json",
                    body: JSON.stringify(resultData)
                });
            } else {
                route.continue();
            }
        });

        // Mocking
        await gui.setEthBalance("100000000000000000000000");

        // Connect wallet
        await page.waitForSelector("button[data-testid='navbar-connect-wallet']");
        await page.locator("button[data-testid='navbar-connect-wallet']").first().click();
        await page.waitForSelector("button[data-testid='wallet-option-INJECTED']");
        await page.locator("button[data-testid='wallet-option-INJECTED']").first().click();

        // Select output currency
        await page.waitForSelector("span:has-text('Select token')");
        await page.locator("span:has-text('Select token')").first().click();
        await page.waitForSelector("text='USDC'");
        await page.locator("text='USDC'").first().click();

        // Enter amount
        await page.waitForSelector(".token-amount-input");
        await page.locator(".token-amount-input").first().fill("1");

        // Open swap modal
        await page.waitForSelector("button[data-testid='swap-button']");
        await page.locator("button[data-testid='swap-button']").first().click();

        // Get USDC balance before
        // const usdcBalanceBefore = await gui.getBalance("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", walletAddress);
        // console.log("USDC balance before: " + usdcBalanceBefore);

        // Confirm action
        await gui.validateContractInteraction("button[data-testid='confirm-swap-button']", "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD");

        // Get USDC balance after
        // const usdcBalanceAfter = await gui.getBalance("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", walletAddress);
        // console.log("USDC balance after: " + usdcBalanceAfter);
        // test.expect(ethers.BigNumber.from(usdcBalanceAfter).toNumber()).toBeGreaterThan(ethers.BigNumber.from(usdcBalanceBefore).toNumber());
    });
});