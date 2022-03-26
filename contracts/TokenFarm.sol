// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFarm is Ownable {
    address public token;
    address constant Ether = address(0);
    address[] public stakers;
    address[] public allowedToken;

    mapping(address => bool) public token_to_bool;
    mapping(address => mapping(address => uint256)) public token_staker_amount;

    constructor(address _token) {
        token = _token;
        token_to_bool[_token] = true;
        token_to_bool[Ether] = true;
        allowedToken = [_token, Ether];
    }

    function stake(address _token, uint256 _amount) public {
        // Which token to stake
        // How much to stake
        require(token_to_bool[_token], "This Token not allowed.");
        require(_amount > 0, "Need more.");

        token_staker_amount[_token][msg.sender] = _amount;
    }

    function addAllowedToken(address _token) public onlyOwner {
        token_to_bool[_token] = true;
        allowedToken.push(_token);
    }
}
