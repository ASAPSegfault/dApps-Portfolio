pragma solidity >=0.4.21 <0.9.0;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/SignedSafeMath.sol";

contract EldoraDex {

    using SafeMath for uint;
    using SignedSafeMath for int;

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
        address trader;
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
    uint nextTradeId;
    bytes32 constant EDAI = bytes32('EDAI');
    
    /*
        Check if the token is tradeable on the exchange.
     */

    modifier tokenExistOnExchange(bytes32 ticker) {
        require(tokens[ticker].tokenAddress != address(0), 'Token must be tradable on EldoraDEX');
        _;
    }

    modifier tokenIsNotEldoraDai(bytes32 ticker) {
        require(ticker != EDAI, 'EDAI is not allowed to be traded');
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, 'Only admin' );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function depositTokens(uint amount, bytes32 ticker) tokenExistOnExchange (ticker) external { 
        IERC20(tokens[ticker].tokenAddress).transferFrom(msg.sender, address(this), amount);
        traderBalances[msg.sender][ticker] = traderBalances[msg.sender][ticker].add(amount);
    }

    function withdrawTokens(uint amount, bytes32 ticker) tokenExistOnExchange(ticker) external {
        require(traderBalances[msg.sender][ticker] >= amount, "Account's balance is too low");
        traderBalances[msg.sender][ticker] = traderBalances[msg.sender][ticker].sub(amount);
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
            require(traderBalances[msg.sender][EDAI] >= amount.mul(price), "EDAI balance is too low");
        }
        Order[] storage orders = orderBook[ticker][uint(side)];
        orders.push(Order(
            nextOrderId,
            price,
            amount,
            ticker,
            0,
            side,
            msg.sender,
            block.timestamp
        ));
        uint index = orders.length > 0 ? orders.length.sub(1) : 0;
        while (index > 0) {
            if (Side.SELL == side && orders[index.sub(1)].price < orders[index].price) {
                break;
            }
            else if (Side.BUY == side && orders[index.sub(1)].price > orders[index].price) {
                break;
            }
            Order memory previousOrder = orders[index.sub(1)];
            orders[index.sub(1)] = orders[index]; 
            orders[index] = previousOrder;
            index = index.sub(1);
        }
        nextOrderId = nextOrderId.add(1);
    }

    /*
        Create a buy or sell MARKET order. Also delete filled orders from the order book. 
     */

    function createMarketOrder(Side side, bytes32 ticker, uint amount) 
    tokenExistOnExchange(ticker)
    tokenIsNotEldoraDai(ticker) external {
        if (side == Side.SELL) {
            require(traderBalances[msg.sender][ticker] >= amount, "Token balance is too low");
        }
        Order[] storage orders = orderBook[ticker][uint(side == Side.BUY ? Side.SELL : Side.BUY)];
        uint index;
        uint remainingMarketOrderAmount = amount;

        while (index < orders.length && remainingMarketOrderAmount > 0) {
            uint availableLimitOrderAmount = orders[index].amount.sub(orders[index].filled);
            uint matchedAmount = remainingMarketOrderAmount > availableLimitOrderAmount 
            ? availableLimitOrderAmount : remainingMarketOrderAmount;
            remainingMarketOrderAmount = remainingMarketOrderAmount.sub(matchedAmount);
            orders[index].filled = orders[index].filled.add(matchedAmount);

            emit NewTrade(
                block.timestamp,
                nextTradeId,
                orders[index].id,
                orders[index].trader,
                msg.sender,
                ticker,
                matchedAmount,
                orders[index].price
            );

            if (side == Side.BUY) {
                require(traderBalances[msg.sender][EDAI] >= matchedAmount.mul(orders[index].price), 'EDAI balance is too low');
                traderBalances[msg.sender][ticker] = traderBalances[msg.sender][ticker]
                    .add(matchedAmount);
                traderBalances[msg.sender][EDAI] = traderBalances[msg.sender][EDAI]
                    .sub(matchedAmount.mul(orders[index].price));
                traderBalances[orders[index].trader][ticker] = traderBalances[orders[index].trader][ticker]
                    .sub(matchedAmount);
                traderBalances[orders[index].trader][EDAI] = traderBalances[orders[index].trader][EDAI]
                    .add(matchedAmount.mul(orders[index].price));
            }
            else if (side == Side.SELL) {
                traderBalances[msg.sender][ticker] = traderBalances[msg.sender][ticker]
                    .sub(matchedAmount);
                traderBalances[msg.sender][EDAI] = traderBalances[msg.sender][EDAI]
                    .add(matchedAmount.mul(orders[index].price));
                traderBalances[orders[index].trader][ticker] = traderBalances[orders[index].trader][ticker]
                    .add(matchedAmount);
                traderBalances[orders[index].trader][EDAI] = traderBalances[orders[index].trader][EDAI]
                    .sub(matchedAmount.mul(orders[index].price));
            }
            index = index.add(1);
            nextTradeId = nextTradeId.add(1);
        }

        index = 0;
        while (index < orders.length && orders[index].filled == orders[index].amount) {
            for (uint swapIndex = index; swapIndex < orders.length - 1; swapIndex = swapIndex.add(1)) {
                orders[swapIndex] = orders[swapIndex.add(1)];
            }
            orders.pop();
            index = index.add(1);
        }
    }

    function getOrders(Side side, bytes32 ticker) external view returns(Order[] memory) {
        return orderBook[ticker][uint(side)];
    }

    function getTokens() external view returns(Token[] memory) {
      Token[] memory _tokens = new Token[](tokensList.length);
      for (uint i = 0; i < tokensList.length; i++) {
        _tokens[i] = Token(
          tokens[tokensList[i]].ticker,
          tokens[tokensList[i]].tokenAddress
        );
      }
      return _tokens;
    }
}