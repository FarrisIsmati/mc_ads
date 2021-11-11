// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MutantCatsAdsPlatform {
    // Contract Creator
    address public owner;
    uint256 public balance;
    address public sinkAddress;
    IERC20 public fish;

    event PaymentDone(
        address payer,
        uint amount,
        uint paymentId,
        uint date
    );

    constructor(address _sinkAddress, address _fishAddress) {
        owner = msg.sender;
        sinkAddress = _sinkAddress;
        fish = IERC20(_fishAddress);
    }

    function pay(uint amount, uint paymentId) external {
        fish.transferFrom(msg.sender, sinkAddress, amount);
        emit PaymentDone(msg.sender, amount, paymentId, block.timestamp);
    }
}



    // receive() payable external {
    //     balance += msg.value;
    //     emit TransferReceived(msg.sender, msg.value);
    // }    

    // function withdraw(uint amount, address payable destAddr) public {
    //     require(msg.sender == owner, "Only owner can withdraw funds"); 
    //     require(amount <= balance, "Insufficient funds");
        
    //     destAddr.transfer(amount);
    //     balance -= amount;
    //     emit TransferSent(msg.sender, destAddr, amount);
    // }

    // function transferERC20(IERC20 token, address to, uint256 amount) public {
    //     require(msg.sender == owner, "Only owner can withdraw funds");
    //     uint256 erc20balance = token.balanceOf(address(this));
    //     require(amount <= erc20balance, "Balance is low");

    //     emit TransferSent(msg.sender, to , amount);
    // }