// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MutantCatsAdsPlatform {
    // Contract Creator
    address public owner;
    uint256 public balance;
    address public sinkAddress;
    IERC20 public fish;

    // Basic Ad
    struct adBasic {
        uint256 startTime;
        uint256 endTime;
        string ipfsUrl;
    }
    // All basic ads that are currently active
    mapping(string => string[]) adBasicActive; 
    // All basic ads active/inactive in their current location (if inactive and value exists means it hasn't been replaced)
    mapping(string => mapping(string => mapping(string => mapping(string => adBasic)))) adBasicMap;

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

        // Defining initial Ad Basic Structure
        // TODO define Ad Wall data structure
        // Ads
        adBasicMap['MUTANTCATS.IO']['AD']['VERTICAL']['AD1V']; // TODO make equal to adBasic contract
        adBasicMap['MUTANTCATS.IO']['AD']['HORIZONTAL']['AD1H'];
        adBasicMap['MUTANTCATS.IO']['AD']['SQUARE']['AD1S'];
        // Spotlight
        adBasicMap['MUTANTCATS.IO']['SPOTLIGHT']['VERTICAL']['SP1V'];
        adBasicMap['MUTANTCATS.IO']['SPOTLIGHT']['HORIZONTAL']['SP1H'];
        adBasicMap['MUTANTCATS.IO']['SPOTLIGHT']['SQUARE']['SP1S'];
    }

    // Getting Ad/Spotlight data
    function getAd(string memory adLocation, string memory adType, string memory orientation, string memory adId) public view returns(adBasic memory) {
        return adBasicMap[adLocation][adType][orientation][adId];
    }

    // Creates new Ad/Spotlight data
    function setAd(
        string memory adLocation, 
        string memory adType, 
        string memory orientation, 
        string memory adId, 
        uint256 startTime, 
        uint256 endTime,
        string ipfsUrl
        ) public returns(bool success) {
        // Get ad in this position
        // If none exists start time will be set now
        // If one exists start time will start after last queued one is in position

        // SPEND TIME THINKING ABOUT HOW ADS SHOULD BE SERVED
        // THIS REALLY DICTATES HOW THINGS WORK
        // QUEUING, SPOT PICKING, ETC
        adBasicMap[adLocation][adType][orientation][adId].startTime = startTime; // Make sure function tah
        return true;
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


// Consider how ads will be formatted
// Image, video, audio
// Spots
// Whats the most organic way to grow from a simple DS

// Types of Ads
// Purposefully Placed Banners
// Location (website,sandbox)
// * Id tied with a location
// Spotlight Banner
// * Id tied with spotlight 
// Ad Wall