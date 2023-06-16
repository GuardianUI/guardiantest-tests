import { test } from "@guardianui/test";
import { ethers } from "ethers";

const EXAMPLE_ACCOUNT = "0x1ce568dbb34b2631acdb5b453c3195ea0070ec65";
const FIXED_TERM_SDA = "0x007F7A1cb838A872515c8ebd16bE4b14Ef43a222";
const FIXED_TERM_TELLER = "0x007F7735baF391e207E3aA380bb53c4Bd9a5Fed6";
const PAYOUT_TOKEN = "0x579cea1889991f68acc35ff5c3dd0621ff29b0c9";
const QUOTE_TOKEN = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

// Requires block 17110784

test.describe("Bond Protocol", () => {
    test("Should approve fixed term auctioneer", async ({ page, gui }) => {
        // Initialize fork
        await gui.initializeChain(1, 17487666);

        // Mock subgraphs
        page.route("https://cloudflare-eth.com/", async (route, request) => {
            if (request.method() === "POST") {
                const data = JSON.parse(request.postData());

                if (data.method) {
                    // Set up provider object to interact with
                    const chainId: string = await page.evaluate("window.ethereum.chainId");
                    const providerUrl: string = await page.evaluate("window.ethereum.provider.connection.url");
                    const provider = new ethers.providers.JsonRpcProvider(providerUrl, parseInt(chainId));

                    // Send the RPC request to Anvil and record the response
                    const resultData = await provider.send(data.method, data.params);

                    const updatedResponseData = {
                        "jsonrpc": "2.0",
                        "id": data.id,
                        "result": resultData
                    };

                    route.fulfill({
                        contentType: "application/json",
                        body: JSON.stringify(updatedResponseData)
                    });
                } else {
                    route.continue();
                }
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
                        "result": "0x1C9C380"
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

        // Set up markets mocking
        page.route("https://gateway.thegraph.com/api/17f8839a7d9c7f990a93cb221bf4248b/subgraphs/id/9F8K4UDnrQEzXsVmHoJxs5qBVDJB5jEKtU9EVsXNTzZZ", async (route, request) => {
            if (request.method() === "POST") {
                const postData = JSON.parse(request.postData() as string);

                if (postData.query.includes("query GetGlobalData")) {
                    console.log("mocking GetGlobalData");

                    const resultData = {
                        "data": {
                            "purchaseCounts": [
                                {
                                    "count": "1517"
                                }
                            ],
                            "uniqueTokenBonderCounts": [
                                {
                                    "count": "3"
                                },
                                {
                                    "count": "31"
                                },
                                {
                                    "count": "10"
                                },
                                {
                                    "count": "16"
                                },
                                {
                                    "count": "174"
                                },
                                {
                                    "count": "4"
                                },
                                {
                                    "count": "47"
                                },
                                {
                                    "count": "17"
                                },
                                {
                                    "count": "51"
                                }
                            ],
                            "tokens": [
                                {
                                    "address": "0x579cea1889991f68acc35ff5c3dd0621ff29b0c9",
                                    "chainId": "1",
                                    "name": "Everipedia IQ",
                                    "decimals": "18",
                                    "symbol": "IQ",
                                    "usedAsPayout": true,
                                    "purchaseCount": "156",
                                    "uniqueBonders": {
                                        "count": "16"
                                    },
                                    "payoutTokenTbvs": [
                                        {
                                            "tbv": "489.40100888",
                                            "quoteToken": {
                                                "id": "1_0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                                                "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                                            }
                                        }
                                    ],
                                    "markets": [
                                        {
                                            "id": "1_BondFixedTermCDA_80",
                                            "name": "BondFixedTermCDA",
                                            "network": "mainnet",
                                            "auctioneer": "0x007f7a1cb838a872515c8ebd16be4b14ef43a222",
                                            "teller": "0x007f7735baf391e207e3aa380bb53c4bd9a5fed6",
                                            "marketId": "80",
                                            "owner": "0x56398b89d53e8731bca8c1b06886cfb14bd6b654",
                                            "callbackAddress": "0x0000000000000000000000000000000000000000",
                                            "capacity": "121000000000000000000000000",
                                            "capacityInQuote": false,
                                            "chainId": "1",
                                            "minPrice": "0",
                                            "scale": "1000000000000000000000000000000000000000",
                                            "start": null,
                                            "conclusion": "1690754400",
                                            "payoutToken": {
                                                "id": "1_0x579cea1889991f68acc35ff5c3dd0621ff29b0c9",
                                                "address": "0x579cea1889991f68acc35ff5c3dd0621ff29b0c9",
                                                "symbol": "IQ",
                                                "decimals": "18",
                                                "name": "Everipedia IQ"
                                            },
                                            "quoteToken": {
                                                "id": "1_0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                                                "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
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
                                            "totalBondedAmount": "211.305",
                                            "totalPayoutAmount": "1000778.5600452839",
                                            "creationBlockTimestamp": "1680393791",
                                            "bondsIssued": "77"
                                        }
                                    ]
                                },
                            ]
                        }
                    };
    
                    route.fulfill({
                        contentType: "application/json",
                        body: JSON.stringify(resultData)
                    });
                } else if (postData.query.includes("query GetDashboardData")) {
                    console.log("mocking GetDashboardData");

                    const resultData = {
                        "data": {
                            "ownerBalances": [],
                            "bondTokens": [
                                {
                                    "id": "0x0352114677f0245a481a79079237e59186f276d5",
                                    "symbol": "OHM-20230620",
                                    "decimals": "9",
                                    "underlying": {
                                        "id": "1_0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
                                        "symbol": "OHM",
                                        "decimals": "9"
                                    },
                                    "expiry": "1687219200",
                                    "teller": "0x007fe70dc9797c4198528ae43d8195fff82bdc95",
                                    "network": "mainnet",
                                    "chainId": "1",
                                    "type": "fixed-expiration"
                                },
                                {
                                    "id": "0x1184e3a0861517dd740cc8b082e81aa8526f9fd3",
                                    "symbol": "INV-20230923",
                                    "decimals": "18",
                                    "underlying": {
                                        "id": "1_0x41d5d79431a913c4ae7d69a668ecdfe5ff9dfb68",
                                        "symbol": "INV",
                                        "decimals": "18"
                                    },
                                    "expiry": "1695427200",
                                    "teller": "0x007fe70dc9797c4198528ae43d8195fff82bdc95",
                                    "network": "mainnet",
                                    "chainId": "1",
                                    "type": "fixed-expiration"
                                },
                                {
                                    "id": "0x13896a26bafeb15597d082c1ca80cfd053bccc6d",
                                    "symbol": "OHM-20230121",
                                    "decimals": "9",
                                    "underlying": {
                                        "id": "1_0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
                                        "symbol": "OHM",
                                        "decimals": "9"
                                    },
                                    "expiry": "1674259200",
                                    "teller": "0x007fe70dc9797c4198528ae43d8195fff82bdc95",
                                    "network": "mainnet",
                                    "chainId": "1",
                                    "type": "fixed-expiration"
                                },
                                {
                                    "id": "0x1ef59d7bcfb58e059e71459bc4912996eff5617b",
                                    "symbol": "JPEG-20230923",
                                    "decimals": "18",
                                    "underlying": {
                                        "id": "1_0xe80c0cd204d654cebe8dd64a4857cab6be8345a3",
                                        "symbol": "JPEG",
                                        "decimals": "18"
                                    },
                                    "expiry": "1695427200",
                                    "teller": "0x007fe70dc9797c4198528ae43d8195fff82bdc95",
                                    "network": "mainnet",
                                    "chainId": "1",
                                    "type": "fixed-expiration"
                                },
                                {
                                    "id": "0x3c1c90b70b43bb1a82fe4b9ff026c39604e65ec1",
                                    "symbol": "OHM-20230923",
                                    "decimals": "9",
                                    "underlying": {
                                        "id": "1_0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
                                        "symbol": "OHM",
                                        "decimals": "9"
                                    },
                                    "expiry": "1695427200",
                                    "teller": "0x007fe70dc9797c4198528ae43d8195fff82bdc95",
                                    "network": "mainnet",
                                    "chainId": "1",
                                    "type": "fixed-expiration"
                                },
                                {
                                    "id": "0x6832fc9ca2a7b816dfdbffb15c22f1867c5934b6",
                                    "symbol": "IQ-20230923",
                                    "decimals": "18",
                                    "underlying": {
                                        "id": "1_0x579cea1889991f68acc35ff5c3dd0621ff29b0c9",
                                        "symbol": "IQ",
                                        "decimals": "18"
                                    },
                                    "expiry": "1695427200",
                                    "teller": "0x007fe70dc9797c4198528ae43d8195fff82bdc95",
                                    "network": "mainnet",
                                    "chainId": "1",
                                    "type": "fixed-expiration"
                                },
                                {
                                    "id": "0xc0b0bcc634dbc815f9cd07b6e393b98f4445b217",
                                    "symbol": "FOX-20230923",
                                    "decimals": "18",
                                    "underlying": {
                                        "id": "1_0xc770eefad204b5180df6a14ee197d99d808ee52d",
                                        "symbol": "FOX",
                                        "decimals": "18"
                                    },
                                    "expiry": "1695427200",
                                    "teller": "0x007fe70dc9797c4198528ae43d8195fff82bdc95",
                                    "network": "mainnet",
                                    "chainId": "1",
                                    "type": "fixed-expiration"
                                },
                                {
                                    "id": "0xdd3b7043b65e3586d12e9bde8c7b938236b3556a",
                                    "symbol": "OHM-20230322",
                                    "decimals": "9",
                                    "underlying": {
                                        "id": "1_0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
                                        "symbol": "OHM",
                                        "decimals": "9"
                                    },
                                    "expiry": "1679443200",
                                    "teller": "0x007fe70dc9797c4198528ae43d8195fff82bdc95",
                                    "network": "mainnet",
                                    "chainId": "1",
                                    "type": "fixed-expiration"
                                }
                            ],
                            "bondPurchases": [],
                            "markets": [],
                            "uniqueBonderCounts": []
                        }
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

        page.route("https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-arbitrum-mainnet", async (route, request) => {
            if (request.method() === "POST") {
                const postData = JSON.parse(request.postData());

                if (postData.query.includes("query GetDashboardData")) {
                    const resultData = {
                        "data": {
                            "ownerBalances": [],
                            "bondTokens": [],
                            "bondPurchases": [],
                            "markets": [],
                            "uniqueBonderCounts": []
                        }
                    };

                    route.fulfill({
                        contentType: "application/json",
                        body: JSON.stringify(resultData)
                    });
                } else if (postData.query.includes("query GetGlobalData")) {
                    const resultData = {
                        "data": {
                            "purchaseCounts": [
                                {
                                    "count": "0"
                                }
                            ],
                            "uniqueTokenBonderCounts": [],
                            "tokens": []
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

        page.route("https://api.thegraph.com/subgraphs/name/bond-protocol/bond-protocol-optimism-mainnet", async (route, request) => {
            if (request.method() === "POST") {
                const postData = JSON.parse(request.postData());

                if (postData.query.includes("query GetDashboardData")) {
                    const resultData = {
                        "data": {
                            "ownerBalances": [],
                            "bondTokens": [],
                            "bondPurchases": [],
                            "markets": [],
                            "uniqueBonderCounts": []
                        }
                    };

                    route.fulfill({
                        contentType: "application/json",
                        body: JSON.stringify(resultData)
                    });
                } else if (postData.query.includes("query GetGlobalData")) {
                    const resultData = {
                        "data": {
                            "purchaseCounts": [
                                {
                                    "count": "0"
                                }
                            ],
                            "uniqueTokenBonderCounts": [],
                            "tokens": []
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
