pragma solidity >=0.4.21 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EldoraDAI is ERC20 {
    constructor() ERC20('EDAI', 'Eldoradex dai') {}
}