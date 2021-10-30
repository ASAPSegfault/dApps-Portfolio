pragma solidity >=0.4.21 <0.9.0;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Eldoradex {

    struct Token {
        bytes32 ticker;
        address tokenAddress;
    }

    struct Order {
        uint id;
        uint price;
        uint amount;
        bytes32 ticker;
        uint filled;
        Side side;
        uint date;
    }

    enum Side {
        BUY,
        SELL
    }

    event NewTrade (
        uint date,
        uint idTrade,
        uint idOrder,
        address indexed trader1,
        address indexed trader2,
        bytes32 indexed ticker,
        uint amount,
        uint price
    );

    mapping(bytes32 => Token) public tokens;
    mapping(address => mapping(bytes32 => uint)) public traderBalances;
    mapping(bytes32 => mapping(uint => Order[])) public orderBook;
    bytes32[] public tokensList;
    address public admin;
    uint nextOrderId;
    bytes32 constant EldoraDAI = bytes32('EDAI');
    
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

    /* 
        Create a LIMIT buy or sell order and push it to the order book.
    */

    function createLimitOrder(Side side, bytes32 ticker, uint amount, uint price) 
    tokenExistOnExchange(ticker) 
    tokenIsNotEldoraDai(ticker) external {
        if (side == Side.SELL) {
            require(traderBalances[msg.sender][ticker] >= amount, "Token balance is too low");
        }
        else if (side == Side.BUY) {
            require(traderBalances[msg.sender][EldoraDAI] >= amount * price, "EDAI balance is too low");
        }
        Order[] storage orders = orderBook[ticker][uint(side)];
        orders.push(Order(
            nextOrderId,
            price,
            amount,
            ticker,
            0,
            side,
            block.timestamp
        ));
        sort(orders);
        nextOrderId++;
    }

    function sort(Order[] storage orders) internal returns(Order[] storage) {
       quickSort(orders, int(0), int(orders.length - 1));
       return orders;
    }
    
    function quickSort(Order[] storage arr, int left, int right) internal {
        int i = left;
        int j = right;
        if (i == j) {
            return;
        }
        uint pivot = arr[uint(left + (right - left) / 2)].price;
        while (i <= j) {
            while (arr[uint(i)].price < pivot) i++;
            while (pivot < arr[uint(j)].price) j--;
            if (i <= j) {
                (arr[uint(i)].price, arr[uint(j)].price) = (arr[uint(j)].price, arr[uint(i)].price);
                i++;
                j--;
            }
        }
        if (left < j)
            quickSort(arr, left, j);
        if (i < right)
            quickSort(arr, i, right);
    }

    /*
        Check if the token is tradeable on the exchange.
     */

    modifier tokenExistOnExchange(bytes32 ticker) {
        require(tokens[ticker].tokenAddress != address(0), 'Token must be tradable on EldoraDEX');
        _;
    }

    modifier tokenIsNotEldoraDai(bytes32 ticker) {
        require(ticker != EldoraDAI, 'EDAI is not allowed to be traded');
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, 'Only admin' );
        _;
    }
}