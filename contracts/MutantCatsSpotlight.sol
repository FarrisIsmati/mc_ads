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
    uint256 public maxLeaderboard; // Max amount of people that can win a spotlight spot for the week
    uint256 public totalBids = 0; // Total number of bids per wallet per week
    uint256 public minBid = 10; // Lowest amount of fish someone can bid
    uint256 public bidId = 0;

    // Winner information for the week
    mapping(address => uint256) winnerMap; // Identifies an address and their place
    uint256[] winnerArr; // Array of

    // Sorting of top X bids handled in front end (TODO Balanced BST, or possibly too much gas to manage on contract)
    struct Bid {
        uint256 amount;
        uint256 bidTime;
    }
    mapping(address => Bid) userBidMap; 

    // TODO
    // Delisted users map, not allowed to bid
    // Admin map, perform admin functions like approval and refreshing fish, removing active spotlight

    // Events
    event PaymentDone(
        address payer,
        uint256 amount,
        uint256 bidId,
        uint256 date
    );

    constructor(address _sinkAddress, address _fishAddress, uint256 _maxLeaderboard) {
        owner = msg.sender;
        sinkAddress = _sinkAddress;
        fish = IERC20(_fishAddress);
        maxLeaderboard = _maxLeaderboard;
    }

    function bid(uint256 amount) public {
        uint256 requestorFishBalance = fish.balanceOf(msg.sender);
        require(requestorFishBalance >= amount, 'You do not have enough Fish in your account');

        // Minimum amount of fish to bid will be 10 if there are less than the max amount of winning bids placed
        require(amount >= minBid, 'Minimum fish limit is 10');

        // If a user has already placed a prior bid
        // Only take the difference of additional fish from their balance and add it to their bid
        if (userBidMap[msg.sender].amount > 0) {
            // Else users bid must be greater than previous bid
            require(userBidMap[msg.sender].amount < amount, 'Your bid must be higher than your previous bid');
            amount = amount - userBidMap[msg.sender].amount;
        } else {
            // Update stats of contract bid if it's a new bid
            bidId += 1;
            totalBids += 1;
        }

        // Receive Fish
        fish.transferFrom(msg.sender, address(this), amount);
        emit PaymentDone(msg.sender, amount, bidId, block.timestamp);

        // Update bid tracker
        Bid memory userBid = Bid(amount, block.timestamp);

        if (userBidMap[msg.sender].amount == 0) {
            // If user not in hashmap add user and update balance
            userBidMap[msg.sender] = userBid;
        } else {
            // If a user is updating a prior bid (increasing only)
            userBidMap[msg.sender].amount = userBidMap[msg.sender].amount + amount;
            userBidMap[msg.sender].bidTime = block.timestamp;
        }
    }

    function getBid(address userAddress) public view returns(Bid memory) {
        return userBidMap[userAddress];
    }

    function sort(uint256[] memory data) public returns(uint256[] memory) {
       quickSort(data, int(0), int(data.length - 1));
       return data;
    }
    
    function quickSort(uint[] memory arr, int left, int right) internal{
        int i = left;
        int j = right;
        if(i==j) return;
        uint pivot = arr[uint(left + (right - left) / 2)];
        while (i <= j) {
            while (arr[uint(i)] < pivot) i++;
            while (pivot < arr[uint(j)]) j--;
            if (i <= j) {
                (arr[uint(i)], arr[uint(j)]) = (arr[uint(j)], arr[uint(i)]);
                i++;
                j--;
            }
        }
        if (left < j)
            quickSort(arr, left, j);
        if (i < right)
            quickSort(arr, i, right);
    }

    // Work on return array in solidity
    // Worst case work on sorting array in solidity, calling array with pos in web3
    // function finalizeWinners() public returns(uint256[] memory) {
    //     uint256[] memory arr1;
    //     arr1[0] = 10;
    //     arr1[1] = 5;
    //     arr1[2] = 1;
    //     arr1[3] = 8;
    //     return arr1;
    //     // return sort(arr1);
    // }
}
