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
                                    "address": "0x2c5bc2ba3614fd27fcc7022ea71d9172e2632c16",
                                    "chainId": "1",
                                    "name": "ShibOriginalVision",
                                    "decimals": "18",
                                    "symbol": "SOV",
                                    "usedAsPayout": true,
                                    "purchaseCount": "4",
                                    "uniqueBonders": {
                                        "count": "3"
                                    },
                                    "payoutTokenTbvs": [
                                        {
                                            "tbv": "126934816.0000000008",
                                            "quoteToken": {
                                                "id": "1_0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
                                                "address": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce"
                                            }
                                        }
                                    ],
                                    "markets": []
                                },
                                {
                                    "address": "0x41d5d79431a913c4ae7d69a668ecdfe5ff9dfb68",
                                    "chainId": "1",
                                    "name": "Inverse DAO",
                                    "decimals": "18",
                                    "symbol": "INV",
                                    "usedAsPayout": true,
                                    "purchaseCount": "82",
                                    "uniqueBonders": {
                                        "count": "31"
                                    },
                                    "payoutTokenTbvs": [
                                        {
                                            "tbv": "256927.7900000000015",
                                            "quoteToken": {
                                                "id": "1_0x865377367054516e17014ccded1e7d814edc9ce4",
                                                "address": "0x865377367054516e17014ccded1e7d814edc9ce4"
                                            }
                                        }
                                    ],
                                    "markets": [
                                        {
                                            "id": "1_BondFixedTermCDA_98",
                                            "name": "BondFixedTermCDA",
                                            "network": "mainnet",
                                            "auctioneer": "0x007f7a1cb838a872515c8ebd16be4b14ef43a222",
                                            "teller": "0x007f7735baf391e207e3aa380bb53c4bd9a5fed6",
                                            "marketId": "98",
                                            "owner": "0x4b6c63e6a94ef26e2df60b89372db2d8e211f1b7",
                                            "callbackAddress": "0x0000000000000000000000000000000000000000",
                                            "capacity": "2087000000000000000000",
                                            "capacityInQuote": false,
                                            "chainId": "1",
                                            "minPrice": "29999999999999997000000000000000000000",
                                            "scale": "1000000000000000000000000000000000000",
                                            "start": null,
                                            "conclusion": "1688079600",
                                            "payoutToken": {
                                                "id": "1_0x41d5d79431a913c4ae7d69a668ecdfe5ff9dfb68",
                                                "address": "0x41d5d79431a913c4ae7d69a668ecdfe5ff9dfb68",
                                                "symbol": "INV",
                                                "decimals": "18",
                                                "name": "Inverse DAO"
                                            },
                                            "quoteToken": {
                                                "id": "1_0x865377367054516e17014ccded1e7d814edc9ce4",
                                                "address": "0x865377367054516e17014ccded1e7d814edc9ce4",
                                                "symbol": "DOLA",
                                                "decimals": "18",
                                                "name": "Dola USD Stablecoin",
                                                "lpPair": null,
                                                "balancerWeightedPool": null
                                            },
                                            "vesting": "2419200",
                                            "vestingType": "fixed-term",
                                            "isInstantSwap": false,
                                            "hasClosed": false,
                                            "totalBondedAmount": "48716.9999999999995",
                                            "totalPayoutAmount": "48822.63333333333286",
                                            "creationBlockTimestamp": "1683053111",
                                            "bondsIssued": "16"
                                        }
                                    ]
                                },
                                {
                                    "address": "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b",
                                    "chainId": "1",
                                    "name": "Convex Token",
                                    "decimals": "18",
                                    "symbol": "CVX",
                                    "usedAsPayout": false,
                                    "purchaseCount": "0",
                                    "uniqueBonders": null,
                                    "payoutTokenTbvs": [],
                                    "markets": []
                                },
                                {
                                    "address": "0x569424c5ee13884a193773fdc5d1c5f79c443a51",
                                    "chainId": "1",
                                    "name": "Pine Token",
                                    "decimals": "18",
                                    "symbol": "PINE",
                                    "usedAsPayout": true,
                                    "purchaseCount": "21",
                                    "uniqueBonders": {
                                        "count": "10"
                                    },
                                    "payoutTokenTbvs": [
                                        {
                                            "tbv": "5.66759",
                                            "quoteToken": {
                                                "id": "1_0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                                                "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                                            }
                                        }
                                    ],
                                    "markets": []
                                },
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
                                {
                                    "address": "0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
                                    "chainId": "1",
                                    "name": "LUSD Stablecoin",
                                    "decimals": "18",
                                    "symbol": "LUSD",
                                    "usedAsPayout": false,
                                    "purchaseCount": "0",
                                    "uniqueBonders": null,
                                    "payoutTokenTbvs": [],
                                    "markets": []
                                },
                                {
                                    "address": "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
                                    "chainId": "1",
                                    "name": "Olympus",
                                    "decimals": "9",
                                    "symbol": "OHM",
                                    "usedAsPayout": false,
                                    "purchaseCount": "0",
                                    "uniqueBonders": null,
                                    "payoutTokenTbvs": [],
                                    "markets": []
                                },
                                {
                                    "address": "0x6b175474e89094c44da98b954eedeac495271d0f",
                                    "chainId": "1",
                                    "name": "Dai Stablecoin",
                                    "decimals": "18",
                                    "symbol": "DAI",
                                    "usedAsPayout": true,
                                    "purchaseCount": "797",
                                    "uniqueBonders": {
                                        "count": "174"
                                    },
                                    "payoutTokenTbvs": [
                                        {
                                            "tbv": "4660662.854323296",
                                            "quoteToken": {
                                                "id": "1_0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
                                                "address": "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5"
                                            }
                                        }
                                    ],
                                    "markets": []
                                },
                                {
                                    "address": "0x865377367054516e17014ccded1e7d814edc9ce4",
                                    "chainId": "1",
                                    "name": "Dola USD Stablecoin",
                                    "decimals": "18",
                                    "symbol": "DOLA",
                                    "usedAsPayout": false,
                                    "purchaseCount": "0",
                                    "uniqueBonders": null,
                                    "payoutTokenTbvs": [],
                                    "markets": []
                                },
                                {
                                    "address": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
                                    "chainId": "1",
                                    "name": "SHIBA INU",
                                    "decimals": "18",
                                    "symbol": "SHIB",
                                    "usedAsPayout": false,
                                    "purchaseCount": "0",
                                    "uniqueBonders": null,
                                    "payoutTokenTbvs": [],
                                    "markets": []
                                },
                                {
                                    "address": "0x98585dfc8d9e7d48f0b1ae47ce33332cf4237d96",
                                    "chainId": "1",
                                    "name": "New Order",
                                    "decimals": "18",
                                    "symbol": "NEWO",
                                    "usedAsPayout": true,
                                    "purchaseCount": "34",
                                    "uniqueBonders": {
                                        "count": "4"
                                    },
                                    "payoutTokenTbvs": [
                                        {
                                            "tbv": "0.260485",
                                            "quoteToken": {
                                                "id": "1_0xc08ed9a9abeabcc53875787573dc32eee5e43513",
                                                "address": "0xc08ed9a9abeabcc53875787573dc32eee5e43513"
                                            }
                                        }
                                    ],
                                    "markets": []
                                },
                                {
                                    "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                                    "chainId": "1",
                                    "name": "USD Coin",
                                    "decimals": "6",
                                    "symbol": "USDC",
                                    "usedAsPayout": false,
                                    "purchaseCount": "0",
                                    "uniqueBonders": null,
                                    "payoutTokenTbvs": [],
                                    "markets": []
                                },
                                {
                                    "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                                    "chainId": "1",
                                    "name": "Wrapped Ether",
                                    "decimals": "18",
                                    "symbol": "WETH",
                                    "usedAsPayout": false,
                                    "purchaseCount": "0",
                                    "uniqueBonders": null,
                                    "payoutTokenTbvs": [],
                                    "markets": []
                                },
                                {
                                    "address": "0xc08ed9a9abeabcc53875787573dc32eee5e43513",
                                    "chainId": "1",
                                    "name": "SushiSwap LP Token",
                                    "decimals": "18",
                                    "symbol": "SLP",
                                    "usedAsPayout": false,
                                    "purchaseCount": "0",
                                    "uniqueBonders": null,
                                    "payoutTokenTbvs": [],
                                    "markets": []
                                },
                                {
                                    "address": "0xc55126051b22ebb829d00368f4b12bde432de5da",
                                    "chainId": "1",
                                    "name": "BTRFLY",
                                    "decimals": "18",
                                    "symbol": "BTRFLY",
                                    "usedAsPayout": true,
                                    "purchaseCount": "188",
                                    "uniqueBonders": {
                                        "count": "47"
                                    },
                                    "payoutTokenTbvs": [
                                        {
                                            "tbv": "544766.99525",
                                            "quoteToken": {
                                                "id": "1_0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                                                "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                                            }
                                        },
                                        {
                                            "tbv": "406.58355999999999988",
                                            "quoteToken": {
                                                "id": "1_0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                                                "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                                            }
                                        }
                                    ],
                                    "markets": []
                                },
                                {
                                    "address": "0xc770eefad204b5180df6a14ee197d99d808ee52d",
                                    "chainId": "1",
                                    "name": "FOX",
                                    "decimals": "18",
                                    "symbol": "FOX",
                                    "usedAsPayout": true,
                                    "purchaseCount": "97",
                                    "uniqueBonders": {
                                        "count": "17"
                                    },
                                    "payoutTokenTbvs": [
                                        {
                                            "tbv": "124410.605000000001",
                                            "quoteToken": {
                                                "id": "1_0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
                                                "address": "0x5f98805a4e8be255a32880fdec7f6728c6568ba0"
                                            }
                                        },
                                        {
                                            "tbv": "32143",
                                            "quoteToken": {
                                                "id": "1_0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                                                "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                                            }
                                        },
                                        {
                                            "tbv": "173347.5",
                                            "quoteToken": {
                                                "id": "1_0xdac17f958d2ee523a2206206994597c13d831ec7",
                                                "address": "0xdac17f958d2ee523a2206206994597c13d831ec7"
                                            }
                                        }
                                    ],
                                    "markets": [
                                        {
                                            "id": "1_BondFixedTermCDA_114",
                                            "name": "BondFixedTermCDA",
                                            "network": "mainnet",
                                            "auctioneer": "0x007f7a1cb838a872515c8ebd16be4b14ef43a222",
                                            "teller": "0x007f7735baf391e207e3aa380bb53c4bd9a5fed6",
                                            "marketId": "114",
                                            "owner": "0x90a48d5cf7343b08da12e067680b4c6dbfe551be",
                                            "callbackAddress": "0x0000000000000000000000000000000000000000",
                                            "capacity": "2900000000000000000000000",
                                            "capacityInQuote": false,
                                            "chainId": "1",
                                            "minPrice": "150000000000000000000000000000000000",
                                            "scale": "10000000000000000000000000000000000000000000000000",
                                            "start": null,
                                            "conclusion": "1689171193",
                                            "payoutToken": {
                                                "id": "1_0xc770eefad204b5180df6a14ee197d99d808ee52d",
                                                "address": "0xc770eefad204b5180df6a14ee197d99d808ee52d",
                                                "symbol": "FOX",
                                                "decimals": "18",
                                                "name": "FOX"
                                            },
                                            "quoteToken": {
                                                "id": "1_0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                                                "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                                                "symbol": "USDC",
                                                "decimals": "6",
                                                "name": "USD Coin",
                                                "lpPair": null,
                                                "balancerWeightedPool": null
                                            },
                                            "vesting": "1814400",
                                            "vestingType": "fixed-term",
                                            "isInstantSwap": false,
                                            "hasClosed": false,
                                            "totalBondedAmount": "0",
                                            "totalPayoutAmount": "0",
                                            "creationBlockTimestamp": "1686764351",
                                            "bondsIssued": "0"
                                        }
                                    ]
                                },
                                {
                                    "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                                    "chainId": "1",
                                    "name": "Tether USD",
                                    "decimals": "6",
                                    "symbol": "USDT",
                                    "usedAsPayout": false,
                                    "purchaseCount": "0",
                                    "uniqueBonders": null,
                                    "payoutTokenTbvs": [],
                                    "markets": []
                                },
                                {
                                    "address": "0xe80c0cd204d654cebe8dd64a4857cab6be8345a3",
                                    "chainId": "1",
                                    "name": "JPEG’d Governance Token",
                                    "decimals": "18",
                                    "symbol": "JPEG",
                                    "usedAsPayout": true,
                                    "purchaseCount": "138",
                                    "uniqueBonders": {
                                        "count": "51"
                                    },
                                    "payoutTokenTbvs": [
                                        {
                                            "tbv": "159363.17648155771242",
                                            "quoteToken": {
                                                "id": "1_0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b",
                                                "address": "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b"
                                            }
                                        }
                                    ],
                                    "markets": []
                                }
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
