// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

contract Lottery {
    address public owner;
    uint256 public round;
    uint256 public lastRoundTime;
    uint256 public winningNumber;
    uint256 public constant ROUND_DURATION = 5 minutes;
    uint256 public constant TICKET_PRICE = 0.001 ether;
    
    mapping(uint256 => mapping(uint256 => address[])) public bets;
    mapping(uint256 => bool) public roundCompleted;
    mapping(uint256 => uint256) public roundWinningNumbers;
    
    event NewBet(address indexed better, uint256 round, uint256 number);
    event RoundCompleted(uint256 round, uint256 winningNumber);
    event Winner(address indexed winner, uint256 amount);
    
    constructor() {
        owner = msg.sender;
        lastRoundTime = block.timestamp;
        round = 1;
    }
    
    function bet(uint256 _number) external payable {
        require(_number >= 0 && _number <= 999, "Number must be 0-999");
        require(msg.value == TICKET_PRICE, "Incorrect bet amount");
        
        bets[round][_number].push(msg.sender);
        emit NewBet(msg.sender, round, _number);
    }
    
    function completeRound() public {
        require(block.timestamp >= lastRoundTime + ROUND_DURATION, "Round not finished");
        require(!roundCompleted[round], "Round already completed");
        
        winningNumber = generateRandomNumber();
        roundCompleted[round] = true;
        roundWinningNumbers[round] = winningNumber;
        
        address[] memory winners = bets[round][winningNumber];
        uint256 prizeAmount = address(this).balance / winners.length;
        
        for (uint256 i = 0; i < winners.length; i++) {
            payable(winners[i]).transfer(prizeAmount);
            emit Winner(winners[i], prizeAmount);
        }
        
        emit RoundCompleted(round, winningNumber);
        
        round++;
        lastRoundTime = block.timestamp;
    }
    
    function generateRandomNumber() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, block.coinbase))) % 1000;
    }
    
    function getLastWinningNumber() public view returns (uint256) {
        return roundWinningNumbers[round - 1];
    }
}