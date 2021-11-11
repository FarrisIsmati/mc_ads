// DEPENDENCIES
require('dotenv').config();
const BigNumber = require('bignumber.js');
const assert = require('assert');
const Web3 = require('web3');
const utils = require('./utils');

// CONTRACTS
const MutantCatsAdsPlatform = artifacts.require('MutantCatsAdsPlatform');
const Fish = artifacts.require('Fish');

contract('MutantCatsAdsPlatform', accounts => {
    const [owner, sink, account1, account2, dumpAccount] = accounts;
    const web3 = new Web3('HTTP://127.0.0.1:7545');

    beforeEach(async () => {
        this.mcAdsPlatform = await MutantCatsAdsPlatform.deployed();
        this.fish = await Fish.deployed();
    });

    describe('Checking initial Ganache deployment is successful', () => {
        it('is owner the owner', async () => {
            const recievedContractOwner = await this.mcAdsPlatform.owner();
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
    });

    describe('Fish contract transfer functions', async () => {
        // afterEach(async () => {
        //     // Dumps all fish from contract after each test to reset
        //     const contractBalance = await utils.getAccountERC20Balance(this.fish, this.mcAdsPlatform.address);

        //     if (contractBalance > 0) {
        //         await this.fish.approve(this.mcAdsPlatform.address, contractBalance, {gas: 5000000, from: owner});
        //         await this.fish.transferFrom(this.mcAdsPlatform.address, dumpAccount, contractBalance);
        //     }
        // });

        it('if account has enough fish in their balance and pledges more than 10 fish it can request an Ad slot', async () => {
            const paymentId = 1;
            const paymentAmount = 10;

            // Get balance of contract before any action is taken
            const contractBalanceBefore = await utils.getAccountERC20Balance(this.fish, this.mcAdsPlatform.address)
            // Get balance of payers fish before executing contract
            const account1BalanceBefore = await utils.getAccountERC20Balance(this.fish, account1)

            // Approve allowance for contract to spend account1 fish
            // Request Ad (pay in fish)
            await this.fish.approve(this.mcAdsPlatform.address, paymentAmount, {gas: 5000000, from: account1})
            await this.mcAdsPlatform.requestAd(paymentAmount, paymentId, {gas: 5000000, from: account1});

            // Ensure payers fish balance decreased by payment amount
            const account1BalanceAfter = await utils.getAccountERC20Balance(this.fish, account1)
            assert.strictEqual(account1BalanceAfter, account1BalanceBefore - paymentAmount);

            // Ensure smart contract recieved increase in fish of payment amount
            const contractBalanceAfter = await utils.getAccountERC20Balance(this.fish, this.mcAdsPlatform.address)
            assert.strictEqual(contractBalanceAfter, contractBalanceBefore + paymentAmount);
        });

        it('if account has enough fish in their balance and pledges less than 10 fish request should not go through', async () => {
            const paymentId = 1;
            const paymentAmount = 9;

            // Get balance of contract before any action is taken
            const contractBalanceBefore = await utils.getAccountERC20Balance(this.fish, this.mcAdsPlatform.address)
            // Get balance of payers fish before executing contract
            const account1BalanceBefore = await utils.getAccountERC20Balance(this.fish, account1)

            try {
                // Approve allowance for contract to spend account1 fish
                // Request Ad (pay in fish)
                await this.fish.approve(this.mcAdsPlatform.address, paymentAmount, {gas: 5000000, from: account1})
                await this.mcAdsPlatform.requestAd(paymentAmount, paymentId, {gas: 5000000, from: account1});
                assert(false);
            } catch(e) {
                assert.strictEqual(e.reason, 'Minimum fish limit is 10');
            }

            // Ensure payers fish balance decreased by payment amount
            const account1BalanceAfter = await utils.getAccountERC20Balance(this.fish, account1)
            assert.strictEqual(account1BalanceAfter, account1BalanceBefore);

            // Ensure smart contract recieved increase in fish of payment amount
            const contractBalanceAfter = await utils.getAccountERC20Balance(this.fish, this.mcAdsPlatform.address)
            assert.strictEqual(contractBalanceAfter, contractBalanceBefore);
        });
    })

});

//balance = await contract.methods.balanceOf(walletAddress).call();
