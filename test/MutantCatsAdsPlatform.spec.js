// DEPENDENCIES
require('dotenv').config();
const BigNumber = require('bignumber.js');
const assert = require('assert');
const Web3 = require('web3');
const utils = require('./utils');

// CONTRACTS
const MutantCatsSpotlightPlatform = artifacts.require('MutantCatsSpotlightPlatform');
const Fish = artifacts.require('Fish');

contract('MutantCatsSpotlightPlatform', accounts => {
    const [owner, sink, account1, account2, dumpAccount] = accounts;
    const web3 = new Web3('HTTP://127.0.0.1:7545');

    beforeEach(async () => {
        this.mcSpotlightPlatform = await MutantCatsSpotlightPlatform.deployed();
        this.fish = await Fish.deployed();
    });

    describe('Checking initial Ganache deployment is successful', () => {
        it('is owner the owner', async () => {
            const recievedContractOwner = await this.mcSpotlightPlatform.owner();
            assert.strictEqual(recievedContractOwner, owner);
        });

        it('sink account has 10000 fish', async () => {
            const balanceBN = await this.fish.balanceOf(sink);

            const sinkBalance = parseInt(BigNumber(balanceBN).toFixed(), 10);

            assert.strictEqual(sinkBalance, 10000);
        });

        it('user account 1 has 10000 fish', async () => {
            const balanceBN = await this.fish.balanceOf(account1);

            const account1Balance = parseInt(BigNumber(balanceBN).toFixed(), 10);

            assert.strictEqual(account1Balance, 10000);
        });

        it('maxSpotlightSpots is set to 100', async () => {
            const maxSpotlightSpotsBN = await this.mcSpotlightPlatform.maxSpotlightSpots.call();
            const maxSpotlightSpots = parseInt(BigNumber(maxSpotlightSpotsBN).toFixed(), 10);

            assert.strictEqual(maxSpotlightSpots, 100);
        });

        // it('totalBids is set to 0', async () => {
        //     const totalBidsBN = await this.mcSpotlightPlatform.totalBids.call();
        //     const totalBids = parseInt(BigNumber(totalBidsBN).toFixed(), 10);

        //     assert.strictEqual(totalBids, 0);
        // });

        // it('minBid is set to 10', async () => {
        //     const minBidBN = await this.mcSpotlightPlatform.minBid.call();
        //     const minBid = parseInt(BigNumber(minBidBN).toFixed(), 10);

        //     assert.strictEqual(minBid, 10);
        // });
    });

    // describe('Fish contract bid function', async () => {
    //     // Account 1
    //     it('if account has enough fish in their balance and bids more than 10 fish they can place a bid', async () => {
    //         const paymentAmount = 10;

    //         // Get balance of contract before any action is taken
    //         const contractBalanceBefore = await utils.getAccountERC20Balance(this.fish, this.mcSpotlightPlatform.address)
    //         // Get balance of payers fish before executing contract
    //         const account1BalanceBefore = await utils.getAccountERC20Balance(this.fish, account1)

    //         // Approve allowance for contract to spend account1 fish
    //         // Place Bid
    //         await this.fish.approve(this.mcSpotlightPlatform.address, paymentAmount, {gas: 5000000, from: account1})
    //         await this.mcSpotlightPlatform.bid(paymentAmount, {gas: 5000000, from: account1});
            
    //         // Ensure payers fish balance decreased by payment amount
    //         const account1BalanceAfter = await utils.getAccountERC20Balance(this.fish, account1)
    //         assert.strictEqual(account1BalanceAfter, account1BalanceBefore - paymentAmount);

    //         // Ensure smart contract recieved increase in fish of payment amount
    //         const contractBalanceAfter = await utils.getAccountERC20Balance(this.fish, this.mcSpotlightPlatform.address)
    //         assert.strictEqual(contractBalanceAfter, contractBalanceBefore + paymentAmount);

    //         // Check if users bid was placed
    //         const userBid = await this.mcSpotlightPlatform.getBid(account1);
    //         const bidAmount = utils.BNtoInt(userBid.amount);
    //         assert.strictEqual(paymentAmount, bidAmount);
    //     });

    //     // Account 2
    //     it('if account has enough fish in their balance and bids less than 10 fish they cannot place a bid', async () => {
    //         const paymentAmount = 9;

    //         // Get balance of contract before any action is taken
    //         const contractBalanceBefore = await utils.getAccountERC20Balance(this.fish, this.mcSpotlightPlatform.address)
    //         // Get balance of payers fish before executing contract
    //         const account2BalanceBefore = await utils.getAccountERC20Balance(this.fish, account2)

    //         try {
    //             // Approve allowance for contract to spend account2 fish
    //             // Place Bid
    //             await this.fish.approve(this.mcSpotlightPlatform.address, paymentAmount, {gas: 5000000, from: account2})
    //             await this.mcSpotlightPlatform.bid(paymentAmount, {gas: 5000000, from: account2});
    //             assert(false);
    //         } catch(e) {
    //             assert.strictEqual(e.reason, 'Minimum fish limit is 10');
    //         }

    //         // Ensure payers fish balance does not decrease
    //         const account2BalanceAfter = await utils.getAccountERC20Balance(this.fish, account2)
    //         assert.strictEqual(account2BalanceAfter, account2BalanceBefore);

    //         // Ensure smart contract does not recieve an increase in fish of payment amount
    //         const contractBalanceAfter = await utils.getAccountERC20Balance(this.fish, this.mcSpotlightPlatform.address)
    //         assert.strictEqual(contractBalanceAfter, contractBalanceBefore);

    //         // Check if users bid was not placed
    //         const userBid = await this.mcSpotlightPlatform.getBid(account2);
    //         const bidAmount = utils.BNtoInt(userBid.amount);
    //         assert.strictEqual(bidAmount, 0);
    //     });

    //     // Account 2
    //     it('if account does not have enough fish in their balance and bids more than 10 fish they cannot place a bid', async () => {
    //         const paymentAmount = 999999;

    //         // Get balance of contract before any action is taken
    //         const contractBalanceBefore = await utils.getAccountERC20Balance(this.fish, this.mcSpotlightPlatform.address)
    //         // Get balance of payers fish before executing contract
    //         const account2BalanceBefore = await utils.getAccountERC20Balance(this.fish, account2)

    //         try {
    //             // Approve allowance for contract to spend account2 fish
    //             // Place Bid
    //             await this.fish.approve(this.mcSpotlightPlatform.address, paymentAmount, {gas: 5000000, from: account2})
    //             await this.mcSpotlightPlatform.bid(paymentAmount, {gas: 5000000, from: account2});
    //             assert(false);
    //         } catch(e) {
    //             assert.strictEqual(e.reason, 'You do not have enough Fish in your account');
    //         }

    //         // Ensure payers fish balance does not decrease
    //         const account2BalanceAfter = await utils.getAccountERC20Balance(this.fish, account2)
    //         assert.strictEqual(account2BalanceAfter, account2BalanceBefore);

    //         // Ensure smart contract does recieve an increase in fish of payment amount
    //         const contractBalanceAfter = await utils.getAccountERC20Balance(this.fish, this.mcSpotlightPlatform.address)
    //         assert.strictEqual(contractBalanceAfter, contractBalanceBefore);

    //         // Check if users bid was placed
    //         const userBid = await this.mcSpotlightPlatform.getBid(account2);
    //         const bidAmount = utils.BNtoInt(userBid.amount);
    //         assert.strictEqual(bidAmount, 0);
    //     });

    //     // Account 1
    //     it('if account does not have enough fish in their balance and bids more than 10 fish they cannot place a bid, but old bid remains', async () => {
    //         const paymentAmount = 999999;

    //         // Get balance of contract before any action is taken
    //         const contractBalanceBefore = await utils.getAccountERC20Balance(this.fish, this.mcSpotlightPlatform.address)
    //         // Get balance of payers fish before executing contract
    //         const account1BalanceBefore = await utils.getAccountERC20Balance(this.fish, account1)

    //         try {
    //             // Approve allowance for contract to spend account1 fish
    //             // Place Bid
    //             await this.fish.approve(this.mcSpotlightPlatform.address, paymentAmount, {gas: 5000000, from: account1})
    //             await this.mcSpotlightPlatform.bid(paymentAmount, {gas: 5000000, from: account1});
    //             assert(false);
    //         } catch(e) {
    //             assert.strictEqual(e.reason, 'You do not have enough Fish in your account');
    //         }

    //         // Ensure payers fish balance does not decrease
    //         const account1BalanceAfter = await utils.getAccountERC20Balance(this.fish, account1)
    //         assert.strictEqual(account1BalanceAfter, account1BalanceBefore);

    //         // Ensure smart contract does recieve an increase in fish of payment amount
    //         const contractBalanceAfter = await utils.getAccountERC20Balance(this.fish, this.mcSpotlightPlatform.address)
    //         assert.strictEqual(contractBalanceAfter, contractBalanceBefore);

    //         // Check if users bid was placed
    //         const userBid = await this.mcSpotlightPlatform.getBid(account1);
    //         const bidAmount = utils.BNtoInt(userBid.amount);
    //         assert.strictEqual(bidAmount, 10); // It's 10 from old bid
    //     });

    //     // Account 1
    //     it('if account has enough fish in their balance and bids more than their previous bid, they only bid net difference of fish', async () => {
    //         await utils.wait(200);

    //         const paymentAmount = 15;

    //         // Get balance of contract before any action is taken
    //         const contractBalanceBefore = await utils.getAccountERC20Balance(this.fish, this.mcSpotlightPlatform.address)
    //         // Get balance of payers fish before executing contract
    //         const account1BalanceBefore = await utils.getAccountERC20Balance(this.fish, account1)

    //         // Get old bid
    //         const userBidOld = await this.mcSpotlightPlatform.getBid(account1);
    //         const bidAmountOld = utils.BNtoInt(userBidOld.amount);
    //         const bidTimeOld = userBidOld.bidTime;

    //         // Approve allowance for contract to spend account1 fish
    //         // Place Bid
    //         await this.fish.approve(this.mcSpotlightPlatform.address, paymentAmount, {gas: 5000000, from: account1})
    //         await this.mcSpotlightPlatform.bid(paymentAmount, {gas: 5000000, from: account1});
            
    //         // Ensure payers fish balance decreased by payment amount
    //         const account1BalanceAfter = await utils.getAccountERC20Balance(this.fish, account1)
    //         assert.strictEqual(account1BalanceAfter, account1BalanceBefore - (paymentAmount - bidAmountOld));

    //         // Ensure smart contract recieved increase in fish of payment amount
    //         const contractBalanceAfter = await utils.getAccountERC20Balance(this.fish, this.mcSpotlightPlatform.address)
    //         assert.strictEqual(contractBalanceAfter, contractBalanceBefore + (paymentAmount - bidAmountOld));

    //         // Check if users bid was placed
    //         const userBid = await this.mcSpotlightPlatform.getBid(account1);
    //         const bidAmount = utils.BNtoInt(userBid.amount);
    //         assert.strictEqual(paymentAmount, bidAmount);

    //         const bidTimeUpdated = userBid.bidTime;
    //         assert(bidTimeUpdated > bidTimeOld);
    //     });

    //     // Account 1
    //     it('if account has enough fish in their balance and bids more than their previous bid, they only bid net difference of fish, additional bid', async () => {
    //         await utils.wait(200);
    //         const paymentAmount = 30;

    //         // Get balance of contract before any action is taken
    //         const contractBalanceBefore = await utils.getAccountERC20Balance(this.fish, this.mcSpotlightPlatform.address)
    //         // Get balance of payers fish before executing contract
    //         const account1BalanceBefore = await utils.getAccountERC20Balance(this.fish, account1)

    //         // Get old bid
    //         const userBidOld = await this.mcSpotlightPlatform.getBid(account1);
    //         const bidAmountOld = utils.BNtoInt(userBidOld.amount);
    //         const bidTimeOld = userBidOld.bidTime;

    //         // Approve allowance for contract to spend account1 fish
    //         // Place Bid
    //         await this.fish.approve(this.mcSpotlightPlatform.address, paymentAmount, {gas: 5000000, from: account1})
    //         await this.mcSpotlightPlatform.bid(paymentAmount, {gas: 5000000, from: account1});
            
    //         // Ensure payers fish balance decreased by payment amount
    //         const account1BalanceAfter = await utils.getAccountERC20Balance(this.fish, account1)
    //         assert.strictEqual(account1BalanceAfter, account1BalanceBefore - (paymentAmount - bidAmountOld));

    //         // Ensure smart contract recieved increase in fish of payment amount
    //         const contractBalanceAfter = await utils.getAccountERC20Balance(this.fish, this.mcSpotlightPlatform.address)
    //         assert.strictEqual(contractBalanceAfter, contractBalanceBefore + (paymentAmount - bidAmountOld));

    //         // Check if users bid was placed
    //         const userBid = await this.mcSpotlightPlatform.getBid(account1);
    //         const bidAmount = utils.BNtoInt(userBid.amount);
    //         assert.strictEqual(paymentAmount, bidAmount);

    //         const bidTimeUpdated = userBid.bidTime;
    //         assert(bidTimeUpdated > bidTimeOld);
    //     });

    //     // Account 1
    //     it('if account has enough fish in their balance and bids less than their previous bid, their bid will fail', async () => {
    //         const paymentAmount = 14;

    //         // Get balance of contract before any action is taken
    //         const contractBalanceBefore = await utils.getAccountERC20Balance(this.fish, this.mcSpotlightPlatform.address)
    //         // Get balance of payers fish before executing contract
    //         const account1BalanceBefore = await utils.getAccountERC20Balance(this.fish, account1)

    //         // Get old bid
    //         const userBidOld = await this.mcSpotlightPlatform.getBid(account1);
    //         const bidAmountOld = utils.BNtoInt(userBidOld.amount);
    //         const bidTimeOld = userBidOld.bidTime;

    //         try {
    //             // Approve allowance for contract to spend account1 fish
    //             // Place Bid
    //             await this.fish.approve(this.mcSpotlightPlatform.address, paymentAmount, {gas: 5000000, from: account1})
    //             await this.mcSpotlightPlatform.bid(paymentAmount, {gas: 5000000, from: account1});
    //             assert(false);
    //         } catch(e) {
    //             assert.strictEqual(e.reason, 'Your bid must be higher than your previous bid')
    //         }

    //         // Ensure payers fish balance has not decreased
    //         const account1BalanceAfter = await utils.getAccountERC20Balance(this.fish, account1)
    //         assert.strictEqual(account1BalanceAfter, account1BalanceBefore);

    //         // Ensure smart contract has not recieved additional fish
    //         const contractBalanceAfter = await utils.getAccountERC20Balance(this.fish, this.mcSpotlightPlatform.address)
    //         assert.strictEqual(contractBalanceAfter, contractBalanceBefore);

    //         // Check if users bid was not updated
    //         const userBid = await this.mcSpotlightPlatform.getBid(account1);
    //         const bidAmount = utils.BNtoInt(userBid.amount);
    //         assert.strictEqual(bidAmountOld, bidAmount);

    //         const bidTimeUpdated = userBid.bidTime;
    //         assert.strictEqual(bidTimeUpdated, bidTimeOld);
    //     });
    // })
});
