// DEPENDENCIES
require('dotenv').config();
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

        it('sink account has fish', async () => {
            const balance = await Fish.methods.balanceOf(sink).call();
            console.log(balance);
            // assert.strictEqual(balance, 1000);
        });
    });

});

//balance = await contract.methods.balanceOf(walletAddress).call();
