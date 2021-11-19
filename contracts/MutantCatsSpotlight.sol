// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MutantCatsSpotlightPlatform {
    // Contract Creator
    address public owner;
    uint256 public balance;
    address public sinkAddress;
    IERC20 public fish;

    // Keep record on purchase numbesr
    uint256 public purchaseId = 0;

    // Tier stats of active spotlights
    uint256 public topTierSpotIndex = 0; // Current index of the top tier spotlight purchase
    uint256 public maxTopTierSpots = 10; // Max amount of people that can hold a top tier spotlight spot
    Spot[] topTierSpots = new Spot[](maxTopTierSpots); // Array of spots to that will hold spotlight

    uint256 public midTierSpotIndex = 0; // Current index of the mid tier spotlight purchase
    uint256 public maxMidTierSpots = 20; // Max amount of people that can hold a mid tier spotlight spot
    Spot[] midTierSpots = new Spot[](maxMidTierSpots); // Array of spots to that will hold spotlight

    uint256 public lowTierSpotIndex = 0; // Current index of the low tier spotlight purchase
    uint256 public maxLowTierSpots = 70; // Max amount of people that can hold a low tier spotlight spot
    Spot[] lowTierSpots = new Spot[](maxlowTierSpots); // Array of spots to that will hold spotlight

    // Users spotlight metadata
    struct Spot {
        address userAddress;
        string imgUrl;
        string blurb;
        uint256 amount;
        uint256 purchaseTime;
    }

    // TODO
    // define storage array that holds user addresses (multiples of 10 fish is 1 position)

    // TODO
    // * Delisted users list, not allowed to bid
    // * Admin user list, admins can delist user addresses and manually override innaporpiate spotlights
    // * Admin update spotlights

    // Events
    event PaymentDone(
        address payer,
        uint256 amount,
        uint256 purchaseId,
        uint256 date
    );

    constructor(address _sinkAddress, address _fishAddress) {
        owner = msg.sender;
        sinkAddress = _sinkAddress;
        fish = IERC20(_fishAddress);
    }

    // MODIFY function
    function getSpot(uint256 amount, string memory imgUrl, string memory blurb) public {
        // Ensure user has enough fish 
        uint256 requestorFishBalance = fish.balanceOf(msg.sender);
        require(requestorFishBalance >= amount, 'You do not have enough Fish in your account');

        // Check if spotlight spot time has expired
        require(checkPositionAvailable(lowTierSpots, lowTierSpotIndex), 'Position time has not yet expired');

        // Check if user has paid the appropiate amount of fish
        require((amount != 50 | amount != 30 | amount != 10), 'You did not pay the correct amount of fish');
        
        // TODO
        // Only keep X% of profits for raffel
        // Rest gets garbage dumped

        // Receive Fish
        fish.transferFrom(msg.sender, address(this), amount);
        emit PaymentDone(msg.sender, amount, purchaseId, block.timestamp);

        // Update puchase Id
        purchaseId += 1;

        if (amount == 50) {
            // Add user to spotlight
            Spot memory userSpot = Spot(msg.sender, imgUrl, blurb, amount, block.timestamp);
            topTierSpots[topTierSpotIndex] = userSpot;
            topTierSpotIndex += 1;

            if (topTierSpotIndex > maxTopTierSpots) {
                topTierSpotIndex = 0;
            }
        } else if (amount == 30) {
            // Add user to spotlight
            Spot memory userSpot = Spot(msg.sender, imgUrl, blurb, amount, block.timestamp);
            midTierSpots[midTierSpotIndex] = userSpot;
            midTierSpotIndex += 1;

            if (midTierSpotIndex > maxMidTierSpots) {
                midTierSpotIndex = 0;
            }
        } else if (amount == 10) {
            // Add user to spotlight
            Spot memory userSpot = Spot(msg.sender, imgUrl, blurb, amount, block.timestamp);
            lowTierSpots[lowTierSpotIndex] = userSpot;
            lowTierSpotIndex += 1;

            if (lowTierSpotIndex > maxLowTierSpots) {
                lowTierSpotIndex = 0;
            }
        }

        // TODO
        // Raffel tally is added up with every user purchase
        // Add user to raffel storage array
        // For every multiple of 10 fish, add their address to the array
        // Once winner is selected (offchain random in passed in)
        // Winner is sent fish and array resets
    }

    // Check if position available (min 1 day apart)
    function checkPositionAvailable(Spot[] spotlightArray, uint256 index) public returns(bool) {
        return block.timestamp - spotlightArray[index].purchaseTime > 86400;
    }

    // Returns a spotlight spot given an index
    function getSpotlight(uint256 index) public view returns(Spot memory) {
        return spotlightSpots[index];
    }

    // TODO
    // function sendFundsToWinners(address winner1, address winner2, address winner3) {
    //     require(msg.sender in adminList, 'You must be an admin to ) // TO BE IN ADMIN LIST
    //     // SEND FISH TO WINNERS
    //     // Winner 1 gets 75%
    //     // Winner 2 gets 15%
    //     // Winner 3 gets 10%
    //     // Receive Fish
    //     fish.transfer(address(winner1), amount);
    //     fish.transfer(address(winner2), amount);
    //     fish.transfer(address(winner3), amount);
    //     emit PaymentDone(winner1, amount, bidId, block.timestamp);
    //     clear out storage array of address entries
    // }


}
