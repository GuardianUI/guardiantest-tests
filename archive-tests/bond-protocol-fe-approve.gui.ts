import { test, utils } from "@guardianui/test";
import { Page } from "@playwright/test";
import { ethers } from "ethers";

// Needs block 17110784

const fixedExpiryTellerAbi = [{"inputs":[{"internalType":"address","name":"protocol_","type":"address"},{"internalType":"contract IBondAggregator","name":"aggregator_","type":"address"},{"internalType":"address","name":"guardian_","type":"address"},{"internalType":"contract Authority","name":"authority_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"CreateFail","type":"error"},{"inputs":[],"name":"Teller_InvalidCallback","type":"error"},{"inputs":[],"name":"Teller_InvalidParams","type":"error"},{"inputs":[],"name":"Teller_NotAuthorized","type":"error"},{"inputs":[{"internalType":"contract ERC20","name":"underlying","type":"address"},{"internalType":"uint48","name":"expiry","type":"uint48"}],"name":"Teller_TokenDoesNotExist","type":"error"},{"inputs":[{"internalType":"uint48","name":"maturesOn","type":"uint48"}],"name":"Teller_TokenNotMatured","type":"error"},{"inputs":[],"name":"Teller_UnsupportedToken","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"contract Authority","name":"newAuthority","type":"address"}],"name":"AuthorityUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"address","name":"referrer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"payout","type":"uint256"}],"name":"Bonded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract ERC20BondToken","name":"bondToken","type":"address"},{"indexed":true,"internalType":"contract ERC20","name":"underlying","type":"address"},{"indexed":true,"internalType":"uint48","name":"expiry","type":"uint48"}],"name":"ERC20BondTokenCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerUpdated","type":"event"},{"inputs":[],"name":"FEE_DECIMALS","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"authority","outputs":[{"internalType":"contract Authority","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"bondTokenImplementation","outputs":[{"internalType":"contract ERC20BondToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ERC20","name":"","type":"address"},{"internalType":"uint48","name":"","type":"uint48"}],"name":"bondTokens","outputs":[{"internalType":"contract ERC20BondToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ERC20[]","name":"tokens_","type":"address[]"},{"internalType":"address","name":"to_","type":"address"}],"name":"claimFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ERC20","name":"underlying_","type":"address"},{"internalType":"uint48","name":"expiry_","type":"uint48"},{"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"create","outputs":[{"internalType":"contract ERC20BondToken","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"createFeeDiscount","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ERC20","name":"underlying_","type":"address"},{"internalType":"uint48","name":"expiry_","type":"uint48"}],"name":"deploy","outputs":[{"internalType":"contract ERC20BondToken","name":"","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ERC20","name":"underlying_","type":"address"},{"internalType":"uint48","name":"expiry_","type":"uint48"}],"name":"getBondToken","outputs":[{"internalType":"contract ERC20BondToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"}],"name":"getBondTokenForMarket","outputs":[{"internalType":"contract ERC20BondToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"referrer_","type":"address"}],"name":"getFee","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"protocolFee","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient_","type":"address"},{"internalType":"address","name":"referrer_","type":"address"},{"internalType":"uint256","name":"id_","type":"uint256"},{"internalType":"uint256","name":"amount_","type":"uint256"},{"internalType":"uint256","name":"minAmountOut_","type":"uint256"}],"name":"purchase","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ERC20BondToken","name":"token_","type":"address"},{"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"redeem","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referrerFees","outputs":[{"internalType":"uint48","name":"","type":"uint48"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"contract ERC20","name":"","type":"address"}],"name":"rewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract Authority","name":"newAuthority","type":"address"}],"name":"setAuthority","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint48","name":"discount_","type":"uint48"}],"name":"setCreateFeeDiscount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint48","name":"fee_","type":"uint48"}],"name":"setProtocolFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint48","name":"fee_","type":"uint48"}],"name":"setReferrerFee","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const fixedExpirySdaAbi = [{"inputs":[{"internalType":"contract IBondTeller","name":"teller_","type":"address"},{"internalType":"contract IBondAggregator","name":"aggregator_","type":"address"},{"internalType":"address","name":"guardian_","type":"address"},{"internalType":"contract Authority","name":"authority_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"Auctioneer_AmountLessThanMinimum","type":"error"},{"inputs":[],"name":"Auctioneer_BadExpiry","type":"error"},{"inputs":[],"name":"Auctioneer_InitialPriceLessThanMin","type":"error"},{"inputs":[],"name":"Auctioneer_InvalidCallback","type":"error"},{"inputs":[],"name":"Auctioneer_InvalidParams","type":"error"},{"inputs":[{"internalType":"uint256","name":"conclusion_","type":"uint256"}],"name":"Auctioneer_MarketConcluded","type":"error"},{"inputs":[],"name":"Auctioneer_MaxPayoutExceeded","type":"error"},{"inputs":[],"name":"Auctioneer_NewMarketsNotAllowed","type":"error"},{"inputs":[],"name":"Auctioneer_NotAuthorized","type":"error"},{"inputs":[],"name":"Auctioneer_NotEnoughCapacity","type":"error"},{"inputs":[],"name":"Auctioneer_OnlyMarketOwner","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"contract Authority","name":"newAuthority","type":"address"}],"name":"AuthorityUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint32","name":"defaultTuneInterval","type":"uint32"},{"indexed":false,"internalType":"uint32","name":"defaultTuneAdjustment","type":"uint32"},{"indexed":false,"internalType":"uint32","name":"minDebtDecayInterval","type":"uint32"},{"indexed":false,"internalType":"uint32","name":"minDepositInterval","type":"uint32"},{"indexed":false,"internalType":"uint32","name":"minMarketDuration","type":"uint32"},{"indexed":false,"internalType":"uint32","name":"minDebtBuffer","type":"uint32"}],"name":"DefaultsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"MarketClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"address","name":"payoutToken","type":"address"},{"indexed":true,"internalType":"address","name":"quoteToken","type":"address"},{"indexed":false,"internalType":"uint48","name":"vesting","type":"uint48"},{"indexed":false,"internalType":"uint256","name":"initialPrice","type":"uint256"}],"name":"MarketCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"oldControlVariable","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newControlVariable","type":"uint256"}],"name":"Tuned","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"adjustments","outputs":[{"internalType":"uint256","name":"change","type":"uint256"},{"internalType":"uint48","name":"lastAdjustment","type":"uint48"},{"internalType":"uint48","name":"timeToAdjusted","type":"uint48"},{"internalType":"bool","name":"active","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"allowNewMarkets","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"authority","outputs":[{"internalType":"contract Authority","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"callbackAuthorized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"}],"name":"closeMarket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"params_","type":"bytes"}],"name":"createMarket","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"}],"name":"currentCapacity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"}],"name":"currentControlVariable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"}],"name":"currentDebt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"defaultTuneAdjustment","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"defaultTuneInterval","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAggregator","outputs":[{"internalType":"contract IBondAggregator","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"}],"name":"getMarketInfoForPurchase","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"callbackAddr","type":"address"},{"internalType":"contract ERC20","name":"payoutToken","type":"address"},{"internalType":"contract ERC20","name":"quoteToken","type":"address"},{"internalType":"uint48","name":"vesting","type":"uint48"},{"internalType":"uint256","name":"maxPayout","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTeller","outputs":[{"internalType":"contract IBondTeller","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"}],"name":"isInstantSwap","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"}],"name":"isLive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"}],"name":"marketPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"}],"name":"marketScale","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"markets","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"contract ERC20","name":"payoutToken","type":"address"},{"internalType":"contract ERC20","name":"quoteToken","type":"address"},{"internalType":"address","name":"callbackAddr","type":"address"},{"internalType":"bool","name":"capacityInQuote","type":"bool"},{"internalType":"uint256","name":"capacity","type":"uint256"},{"internalType":"uint256","name":"totalDebt","type":"uint256"},{"internalType":"uint256","name":"minPrice","type":"uint256"},{"internalType":"uint256","name":"maxPayout","type":"uint256"},{"internalType":"uint256","name":"sold","type":"uint256"},{"internalType":"uint256","name":"purchased","type":"uint256"},{"internalType":"uint256","name":"scale","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"},{"internalType":"address","name":"referrer_","type":"address"}],"name":"maxAmountAccepted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"metadata","outputs":[{"internalType":"uint48","name":"lastTune","type":"uint48"},{"internalType":"uint48","name":"lastDecay","type":"uint48"},{"internalType":"uint32","name":"length","type":"uint32"},{"internalType":"uint32","name":"depositInterval","type":"uint32"},{"internalType":"uint32","name":"tuneInterval","type":"uint32"},{"internalType":"uint32","name":"tuneAdjustmentDelay","type":"uint32"},{"internalType":"uint32","name":"debtDecayInterval","type":"uint32"},{"internalType":"uint256","name":"tuneIntervalCapacity","type":"uint256"},{"internalType":"uint256","name":"tuneBelowCapacity","type":"uint256"},{"internalType":"uint256","name":"lastTuneDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minDebtBuffer","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minDebtDecayInterval","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minDepositInterval","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minMarketDuration","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"newOwners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount_","type":"uint256"},{"internalType":"uint256","name":"id_","type":"uint256"},{"internalType":"address","name":"referrer_","type":"address"}],"name":"payoutFor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"}],"name":"pullOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"},{"internalType":"uint256","name":"amount_","type":"uint256"},{"internalType":"uint256","name":"minAmountOut_","type":"uint256"}],"name":"purchaseBond","outputs":[{"internalType":"uint256","name":"payout","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"},{"internalType":"address","name":"newOwner_","type":"address"}],"name":"pushOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"status_","type":"bool"}],"name":"setAllowNewMarkets","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract Authority","name":"newAuthority","type":"address"}],"name":"setAuthority","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"creator_","type":"address"},{"internalType":"bool","name":"status_","type":"bool"}],"name":"setCallbackAuthStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32[6]","name":"defaults_","type":"uint32[6]"}],"name":"setDefaults","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id_","type":"uint256"},{"internalType":"uint32[3]","name":"intervals_","type":"uint32[3]"}],"name":"setIntervals","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"terms","outputs":[{"internalType":"uint256","name":"controlVariable","type":"uint256"},{"internalType":"uint256","name":"maxDebt","type":"uint256"},{"internalType":"uint48","name":"vesting","type":"uint48"},{"internalType":"uint48","name":"conclusion","type":"uint48"}],"stateMutability":"view","type":"function"}];

const createMarket = async (page: Page) => {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545", 1);

    // Impersonate Olympus Account
    await provider.send(
        "anvil_impersonateAccount",
        ["0x1ce568dbb34b2631acdb5b453c3195ea0070ec65"]
    );
    const signer = await provider.getSigner("0x1ce568dbb34b2631acdb5b453c3195ea0070ec65");

    const fixedExpiryTeller = new ethers.Contract("0x007FE70dc9797C4198528aE43d8195ffF82Bdc95", fixedExpiryTellerAbi, signer);
    const fixedExpirySDA = new ethers.Contract("0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD", fixedExpirySdaAbi, signer);

    // Set ETH balance
    const ethBn = ethers.utils.parseEther("1000");
    await provider.send(
        "anvil_setBalance",
        [
            "0x1ce568dbb34b2631acdb5b453c3195ea0070ec65",
            ethers.utils.hexlify(ethBn)
        ]
    );

    // Set OHM balance
    const balanceSlot = await utils.findBalanceSlot("0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5", page);
    const userBalanceSlot = utils.getBalanceSlot("0x1ce568dbb34b2631acdb5b453c3195ea0070ec65", balanceSlot);
    const bnAmount = ethers.BigNumber.from("100000000000000000");
    await provider.send(
        "anvil_setStorageAt",
        [
            "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
            userBalanceSlot,
            ethers.utils.hexZeroPad(ethers.utils.hexlify(bnAmount), 32)
        ]
    );

    // Set OHM allowance
    const allowanceSlot = await utils.findAllowanceSlot("0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5", page);
    const tellerAllowanceSlot = utils.getAllowanceSlot("0x1ce568dbb34b2631acdb5b453c3195ea0070ec65", "0x007FE70dc9797C4198528aE43d8195ffF82Bdc95", allowanceSlot);
    const sdaAllowanceSlot = utils.getAllowanceSlot("0x1ce568dbb34b2631acdb5b453c3195ea0070ec65", "0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD", allowanceSlot);
    await provider.send(
        "anvil_setStorageAt",
        [
            "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
            tellerAllowanceSlot,
            ethers.utils.hexZeroPad(ethers.utils.hexlify(bnAmount), 32)
        ]
    );
    await provider.send(
        "anvil_setStorageAt",
        [
            "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
            sdaAllowanceSlot,
            ethers.utils.hexZeroPad(ethers.utils.hexlify(bnAmount), 32)
        ]
    );

    // Create 1 day bond token
    const bondTokenTx = await fixedExpiryTeller.deploy("0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5", "1702425600");
    await bondTokenTx.wait();

    // Create SDA market
    const abiCoder = new ethers.utils.AbiCoder();
    const params = abiCoder.encode(
        ["address", "address", "address", "bool", "uint256", "uint256",
    "uint256", "uint32", "uint48", "uint48", "uint32", "int8"],
        [
            "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
            "0x6b175474e89094c44da98b954eedeac495271d0f",
            "0x0000000000000000000000000000000000000000",
            false,
            "100000000000000000",
            "1000000000000000000000000000000000000",
            "500000000000000000000000000000000000",
            "100000",
            "1702425600",
            "1692242115",
            "21600",
            "0"
        ]
    );
    const sdaMarketTx = await fixedExpirySDA.createMarket(params);
    await sdaMarketTx.wait();

    // Stop impersonating Olympus Account
    await provider.send(
        "anvil_stopImpersonatingAccount",
        ["0x1ce568dbb34b2631acdb5b453c3195ea0070ec65"]
    );
};

test.describe("Bond Protocol", () => {
    test("Should approve fixed expiry teller", async ({ page, gui }) => {
        // Initialize fork
        await gui.initializeChain(1, 17110784);

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
                                    "address": "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
                                    "chainId": "1",
                                    "name": "Olympus",
                                    "decimals": "9",
                                    "symbol": "OHM",
                                    "usedAsPayout": false,
                                    "purchaseCount": "0",
                                    "uniqueBonders": null,
                                    "payoutTokenTbvs": [],
                                    "markets": [
                                        {
                                            "id": "1_BondFixedExpCDA_94",
                                            "name": "BondFixedExpCDA",
                                            "network": "mainnet",
                                            "auctioneer": "0x007FEA32545a39Ff558a1367BBbC1A22bc7ABEfD",
                                            "teller": "0x007FE70dc9797C4198528aE43d8195ffF82Bdc95",
                                            "marketId": "94",
                                            "owner": "0x1ce568dbb34b2631acdb5b453c3195ea0070ec65",
                                            "callbackAddress": "0x0000000000000000000000000000000000000000",
                                            "capacity": "100000000000000000",
                                            "capacityInQuote": false,
                                            "chainId": "1",
                                            "minPrice": "500000000000000000000000000000000000",
                                            "scale": "10000000000000000000000000000000000000",
                                            "start": null,
                                            "conclusion": "1692242115",
                                            "payoutToken": {
                                                "id": "1_0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
                                                "address": "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
                                                "symbol": "OHM",
                                                "decimals": "9",
                                                "name": "Olympus"
                                            },
                                            "quoteToken": {
                                                "id": "1_0x6b175474e89094c44da98b954eedeac495271d0f",
                                                "address": "0x6b175474e89094c44da98b954eedeac495271d0f",
                                                "symbol": "DAI",
                                                "decimals": "18",
                                                "name": "DAI Stablecoin",
                                                "lpPair": null,
                                                "balancerWeightedPool": null
                                            },
                                            "vesting": "1702425600",
                                            "vestingType": "fixed-exp",
                                            "isInstantSwap": false,
                                            "hasClosed": false,
                                            "totalBondedAmount": "0",
                                            "totalPayoutAmount": "0",
                                            "creationBlockTimestamp": "1682245571"
                                        },
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

        // Create market
        await createMarket(page);

        await page.reload();

        // Mocking
        await gui.setEthBalance("100000000000000000000000");
        await gui.setBalance("0x6b175474e89094c44da98b954eedeac495271d0f", "1000000000000000000000000");

        await page.waitForSelector("tbody > tr");
        await page.locator("tbody > tr >> nth=0").click();

        // Verify that approval uses the correct contract
        await page.waitForSelector("button:has-text('APPROVE')");
        await gui.validateContractInteraction("button:has-text('APPROVE')", "0x007FE70dc9797C4198528aE43d8195ffF82Bdc95");
    });
});
