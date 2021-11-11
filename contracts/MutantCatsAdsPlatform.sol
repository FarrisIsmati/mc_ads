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

    // requester sends fish
    // fish gets added to contract
    // contract is holding x fish that address sent into the contract
    // contract updates how much fish of said user is being held

    // TODO: AD tiers come into play based on amount and location
    function requestAd(uint256 amount, uint256 paymentId) public {
        // Pledge minimum is 10 Fish
        require(amount >= 10, 'Minimum fish limit is 10');
        uint256 requestorFishBalance = fish.balanceOf(msg.sender);
        require(requestorFishBalance >= amount, 'You do not have enough Fish in your account');

        // Receive Fish
        fish.transferFrom(msg.sender, address(this), amount);
        emit PaymentDone(msg.sender, amount, paymentId, block.timestamp);

        // If user not in hashmap add user and update balance
        
        // Else update user balance
    }

    // // After an AD gets approved
    // // Get address of user whos ad was approved
    // // Remove fish from their balance in hashmap
    // // Send fish to sink
    // function sinkFish(address user, uint amount, uint paymentId) external {
    //     // require(amount <= erc20balance, "Balance is ");
    //     fish.transferFrom(msg.sender, sinkAddress, amount);
    //     emit PaymentDone(msg.sender, amount, paymentId, block.timestamp);
    // }

    // // After an AD gets rejected
    // // Get address of user whos rejected
    // // Subtract amount of fish from users address in hashmap
    // // Return x fish to users address who got rejected
    // function returnFish(address user, uint amount) external {
    //     // require(amount <= erc20balance, "Balance is ");
    //     fish.transferFrom(msg.sender, sinkAddress, amount);
    //     emit PaymentDone(msg.sender, amount, paymentId, block.timestamp);
    // }
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
