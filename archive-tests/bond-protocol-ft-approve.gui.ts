import { test } from "@guardianui/test";

const EXAMPLE_ACCOUNT = "0x1ce568dbb34b2631acdb5b453c3195ea0070ec65";
const FIXED_TERM_SDA = "0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222";
const FIXED_TERM_TELLER = "0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6";
const PAYOUT_TOKEN = "0x579cea1889991f68acc35ff5c3dd0621ff29b0c9";
const QUOTE_TOKEN = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

// Requires block 17110784

test.describe("Bond Protocol", () => {
    test("Should approve fixed term auctioneer", async ({ page, gui }) => {
        // Initialize fork
        await gui.initializeChain(1, 17110784);

        // Mock subgraph
        page.route("https://gateway.thegraph.com/api/17f8839a7d9c7f990a93cb221bf4248b/subgraphs/id/9F8K4UDnrQEzXsVmHoJxs5qBVDJB5jEKtU9EVsXNTzZZ", async (route, request) => {
            if (request.method() === "POST") {
                const postData = JSON.parse(request.postData() as string);

                if (postData.query.includes("query ListMarkets")) {
                    console.log("ListMarkets");

                    const resultData = {
                        "data": {
                            "markets": [
                                {
                                    "id": "1_BondFixedTermCDA_80",
                                    "name": "BondFixedTermCDA",
                                    "network": "mainnet",
                                    "auctioneer": FIXED_TERM_SDA,
                                    "teller": FIXED_TERM_TELLER,
                                    "marketId": "80",
                                    "owner": EXAMPLE_ACCOUNT,
                                    "callbackAddress": "0x0000000000000000000000000000000000000000",
                                    "capacity": "121000000000000000000000000",
                                    "capacityInQuote": false,
                                    "chainId": "1",
                                    "minPrice": "0",
                                    "scale": "1000000000000000000000000000000000000000",
                                    "start": null,
                                    "conclusion": "1690754400",
                                    "payoutToken": {
                                        "id": `1_${PAYOUT_TOKEN}`,
                                        "address": PAYOUT_TOKEN,
                                        "symbol": "IQ",
                                        "decimals": "18",
                                        "name": "Everipedia IQ"
                                    },
                                    "quoteToken": {
                                        "id": `1_${QUOTE_TOKEN}`,
                                        "address": QUOTE_TOKEN,
                                        "symbol": "WETH",
                                        "decimals": "18",
                                        "name": "Wrapped Ether",
                                        "lpPair": null,
                                        "balancerWeightedPool": null
                                    },
                                    "vesting": "604800",
                                    "vestingType": "fixed-term",
                                    "isInstantSwap": false,
                                    "hasClosed": false,
                                    "totalBondedAmount": "94.145",
                                    "totalPayoutAmount": "29999129.676172346866",
                                    "creationBlockTimestamp": "1680393791"
                                },
                            ]
                        }
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

        // Go to bond protocol
        await page.goto("https://app.bondprotocol.finance/#/markets");

        // Mocking
        await gui.setEthBalance("100000000000000000000000");
        await gui.setBalance("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "1000000000000000000000000");

        // No allowance yet

        await page.waitForSelector("tbody > tr");
        await page.locator("tbody > tr >> nth=0").click();

        // Verify that approval uses the correct contract
        await page.waitForSelector("button:has-text('APPROVE')");
        await gui.validateContractInteraction("button:has-text('APPROVE')", FIXED_TERM_TELLER);
    });
});
