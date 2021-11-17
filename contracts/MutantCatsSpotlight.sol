// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MutantCatsSpotlightPlatform {
    // Contract Creator
    address public owner;
    uint256 public balance;
    address public sinkAddress;
    IERC20 public fish;

    // Stats
    // Data for tracking bids and addresses
    uint256 public maxSpotlightSpots = 100; // Max amount of people that can hold a spotlight spot
    uint256 public spotIndex = 0; // Current index of the spotlight purchase

    // Winner information for the day
    mapping(address => uint256) winnerMap; // Identifies an address and their place
    struct Spot {
        address userAddress;
        string imgUrl;
        string blurb;
        uint256 amount;
        uint256 purchaseTime;
    }
    Spot[maxSpotlightSpots] spotlightSpots = new Spot[maxSpotlightSpots]; // Array of spots to that will hold spotlight

    // Raffel
    // Winner selected offchain
    uint256 raffelIndex = 0;
    address[200][] raffelArray;

    // TODO
    // * Delisted users list, not allowed to bid
    // * Admin user list, admins can delist user addresses and manually override innaporpiate spotlights
    // * Admin update spotlights

    // Events
    event PaymentDone(
        address payer,
        uint256 amount,
        uint256 bidId,
        uint256 date
    );

    constructor(address _sinkAddress, address _fishAddress) {
        owner = msg.sender;
        sinkAddress = _sinkAddress;
        fish = IERC20(_fishAddress);
    }

    // MODIFY function
    function getSpot(uint256 amount, string imgUrl, string blurb) public {
        // Ensure user has enough fish 
        uint256 requestorFishBalance = fish.balanceOf(msg.sender);
        require(requestorFishBalance >= amount, 'You do not have enough Fish in your account');

        if (spotIndex >= 0 && spotIndex <= 9) {
            // Positions 0 - 9 cost 50 fish
            require(amount == 50, 'You must pay 50 fish');
        } else if (spotIndex >= 10 && spotIndex <= 19) {
            // Positions 10 - 19 cost 40 fish
            require(amount == 40, 'You must pay 40 fish');
        } else if (spotIndex >= 20 && spotIndex <= 29) {
            // Positions 20 - 29 cost 30 fish
            require(amount == 30, 'You must pay 30 fish');
        } else if (spotIndex >= 30 && spotIndex <= 39) {
            // Positions 30 - 39 cost 20 fish
            require(amount == 20, 'You must pay 20 fish');
        } else if (spotIndex >= 40 && spotIndex <= 99) {
            // Positions 40 - 99 cost 10 fish
            require(amount == 10, 'You must pay 10 fish');
        }

        // Check if spotlight spot time has expired
        require(checkPositionAvailable(spotIndex), 'Position time has not yet expired');

        // TODO
        // Only keep X% of profits for raffel
        // Rest gets garbage dumped

        // Receive Fish
        fish.transferFrom(msg.sender, address(this), amount);
        emit PaymentDone(msg.sender, amount, bidId, block.timestamp);

        // Add user to spotlight
        Spot memory userSpot = Spot(msg.sender, imgUrl, blurb, amount, block.timestamp);
        spotlightSpots[spotIndex] = userSpot;

        // Reset spotlight once array maxed out
        if (spotIndex == 99) {
            spotIndex = 0;
            storeRaffelArray();
            // After all Spots in rotation have been bought create an array of all potential winners and store them
        }
    }

    // Check if position available (min 1 day apart)
    function checkPositionAvailable(uint256 index) public returns(bool) {
        Spot spot = spotlightSpots[index];
        return block.timestamp - spot.purchaseTime > 86400;
    }

    // Returns a spotlight spot given an index
    function getSpotlight(uint256 index) public view returns(Spot memory) {
        return spotlightSpots[index];
    }

    // Store raffel array
    function storeRaffelArray() private {
        uint256 spotlightArrIndex = 0;
        address[200] spotlightAddressArr= new address[200];
        for(uint256 i = 0; i < maxSpotlightSpots; i += 1) {
            Spot spot = spotlightSpots[i];
            for(uint256 j = 0; j < spot.amount/10; j += 1) {
                spotlightAddressArr[spotlightArrIndex] = spot.userAddress;
                spotlightArrIndex += 1;
            }
        }

        // Update raffel array
        raffelArray[raffelIndex] = spotlightAddressArr;
        raffelIndex += 1;
    }

    // Get raffel array
    // Select winner off chain
    function getRaffelGroup(uint256 index) public view returns(address[] memory) {
        return raffelArray[index];
    }

    function sendFundsToWinners(address winner1, address winner2, address winner3) {
        // TODO
        // SEND FISH TO WINNERS
        // Winner 1 gets 75%
        // Winner 2 gets 15%
        // Winner 3 gets 10%
        // Receive Fish
        fish.transfer(address(winner1), amount);
        fish.transfer(address(winner2), amount);
        fish.transfer(address(winner3), amount);
        // emit PaymentDone(winner1, amount, bidId, block.timestamp);
    }
}
