pragma solidity >=0.4.21 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EldoraGOLEM is ERC20 {
    constructor() ERC20('EGNT', 'Eldoradex Golem Token') {}

    function faucet(address to, uint amount) external {
        _mint(to, amount);
    }
}