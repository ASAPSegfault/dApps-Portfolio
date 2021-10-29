pragma solidity >=0.4.21 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EldoraLINK is ERC20 {
    constructor() ERC20('ELINK', 'Eldoradex Chainlink Token') {}
}