// Testing contract utility functions

// DEPENDENCIES
require('dotenv').config();
const BigNumber = require('bignumber.js');
const assert = require('assert');
const Web3 = require('web3');

module.exports = {
    async getAccountERC20Balance(token, address) {
        const addressBalanceBN = await token.balanceOf(address);
        return parseInt(BigNumber(addressBalanceBN).toFixed(), 10);
    }
}