// DEPENDENCIES
require('dotenv').config();
const BigNumber = require('bignumber.js');
const assert = require('assert');
const Web3 = require('web3');

// CONTRACTS
const MutantCatsAdsPlatform = artifacts.require('MutantCatsAdsPlatform');
const Fish = artifacts.require('Fish');

contract('MutantCatsAdsPlatform', accounts => {
    const [owner, sink, account1, account2] = accounts;
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

            const sinkBalance = parseInt(BigNumber(balanceBN).toFixed(), 10)

            assert.strictEqual(sinkBalance, 10000);
        });

        it('user account 1 has 10000 fish', async () => {
            const balanceBN = await this.fish.balanceOf(account1);

            const account1Balance = parseInt(BigNumber(balanceBN).toFixed(), 10)

            assert.strictEqual(account1Balance, 10000);
        });
    });

});

//balance = await contract.methods.balanceOf(walletAddress).call();
