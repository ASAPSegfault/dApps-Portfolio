pragma solidity >=0.4.21 <0.9.0;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Eldoradex {
    enum Side {
        BUY,
        SELL
    }

    struct Token {
        bytes32 ticker;
        address tokenAddress;
    }

    struct Order {
        uint id;
        bytes32 ticker;
        uint amount;
        uint filled;
        Side side;
        uint date;
    }

    mapping(bytes32 => Token) public tokens;
    mapping(address => mapping(bytes32 => uint)) public traderBalances;
    mapping(bytes32 => mapping(uint => Order[])) public orderBook;
    bytes32[] public tokensList;
    address public admin;
    uint nextOrderId;
    
    constructor() {
        admin = msg.sender;
    }

    function depositTokens(uint amount, bytes32 ticker) tokenExistOnExchange (ticker) external { 
        IERC20(tokens[ticker].tokenAddress).transferFrom(msg.sender, address(this), amount);
        traderBalances[msg.sender][ticker] += amount;
    }

    function withdrawTokens(uint amount, bytes32 ticker) tokenExistOnExchange(ticker) external {
        require(traderBalances[msg.sender][ticker] >= amount, "Account's balance is too low");
        traderBalances[msg.sender][ticker] -= amount;
        IERC20(tokens[ticker].tokenAddress).transfer(msg.sender, amount);
    }

    /* Add new ERC20 Token to the exchange */

    function addToken(
        bytes32 ticker,
        address tokenAddress
        ) onlyAdmin() external {
        tokens[ticker] = Token(ticker, tokenAddress);
        tokensList.push(ticker);
    }

    function createLimitOrder(Side side, bytes32 ticker, uint amount, uint price) tokenExistOnExchange(ticker) external {
        
    }

    modifier tokenExistOnExchange(bytes32 ticker) {
        require(tokens[ticker].tokenAddress != address(0), 'Token must be tradable on EldoraDEX');
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, 'Only admin' );
        _;
    }
}