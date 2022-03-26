// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RALA_Token is ERC20 {
    constructor() public ERC20("RALA Token", "RL") {
        _mint(msg.sender, 1000000000000000000000000);
    }
}
