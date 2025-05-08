// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MonadVoting is Ownable {
    IERC20 public monToken;
    uint256 public constant VOTE_COST = 1 ether; // 1 MON token per vote
    
    struct Option {
        string title;
        string description;
        uint256 voteCount;
    }
    
    Option[] public options;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    
    event VoteCast(address indexed voter, uint256 indexed optionId, uint256 timestamp);
    event OptionAdded(uint256 indexed optionId, string title, string description);
    
    constructor(address _monToken) Ownable(msg.sender) {
        monToken = IERC20(_monToken);
    }
    
    function addOption(string memory _title, string memory _description) external onlyOwner {
        options.push(Option({
            title: _title,
            description: _description,
            voteCount: 0
        }));
        
        emit OptionAdded(options.length - 1, _title, _description);
    }
    
    function castVote(uint256 _optionId) external {
        require(_optionId < options.length, "Invalid option");
        require(!hasVoted[msg.sender][_optionId], "Already voted for this option");
        require(monToken.transferFrom(msg.sender, address(this), VOTE_COST), "Token transfer failed");
        
        options[_optionId].voteCount++;
        hasVoted[msg.sender][_optionId] = true;
        
        emit VoteCast(msg.sender, _optionId, block.timestamp);
    }
    
    function getVotes(uint256 _optionId) external view returns (uint256) {
        require(_optionId < options.length, "Invalid option");
        return options[_optionId].voteCount;
    }
    
    function getOption(uint256 _optionId) external view returns (string memory title, string memory description, uint256 voteCount) {
        require(_optionId < options.length, "Invalid option");
        Option memory option = options[_optionId];
        return (option.title, option.description, option.voteCount);
    }
    
    function getOptionsCount() external view returns (uint256) {
        return options.length;
    }
    
    function withdrawTokens() external onlyOwner {
        uint256 balance = monToken.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(monToken.transfer(owner(), balance), "Token transfer failed");
    }
} 