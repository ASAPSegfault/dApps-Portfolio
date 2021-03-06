import React, { useEffect, useState } from "react";
import Header from './Header.js';
import Footer from './Footer.js';
import AllOrders from "./AllOrdersComponent.js";
import MyOrders from "./MyOrdersComponent.js";
import AllTrades from "./AllTradesComponent.js";
import NewOrder from "./NewOrderComponent.js";
import Wallet from './WalletComponent.js';
import {Mutex, withTimeout} from 'async-mutex';

const ORDER_SIDE = {
  BUY: 0,
  SELL : 1
};

const mutex = new Mutex();

function App({web3, accounts, contracts}) {
  
  const [user, setUser] = useState({
    accounts: [],
    selectedToken: undefined,
    tokenBalances: {
      tokenEldoraDex: 0,
      tokenWallet: 0
    }
  });
  const [tokens, setTokens] = useState([]);
  const [orders, setOrders] = useState({
    buy: [],
    sell: []
  });
  const [trades, setTrades] = useState([]);
  const [listener, setListener] = useState(undefined);

  const selectToken = token => {
    setUser({...user, selectedToken: token})
  }

  const handleTransactionError = error => {
    console.log("Transaction cancelled");
  }

  const getOrders = async token => {
    const orders = await Promise.all([
      contracts.dex.methods
        .getOrders(ORDER_SIDE.BUY, web3.utils.fromAscii(token.ticker))
        .call(),
      contracts.dex.methods
        .getOrders(ORDER_SIDE.SELL, web3.utils.fromAscii(token.ticker))
        .call(),
    ]);
    return {buy: orders[0], sell: orders[1]};
  }

  const getTokensBalances = async (account, token) => {
    const tokenEldoraDex = await contracts.dex.methods
      .traderBalances(account, web3.utils.fromAscii(token.ticker))
      .call();

    const tokenWallet = await contracts[token.ticker].methods
      .balanceOf(account)
      .call();

    return { tokenEldoraDex, tokenWallet }
  }

  const withdraw = async amount => {
    try {
      await contracts.dex.methods
      .withdrawTokens(amount, web3.utils.fromAscii(user.selectedToken.ticker))
      .send({from: user.accounts[0]})
      const tokenBalances = await getTokensBalances(
        user.accounts[0],
        user.selectedToken
      );
      setUser(user => ({...user, tokenBalances}));
    }
    catch(error) {
      handleTransactionError(error)
    }
  }

  const deposit = async amount => {
    try {
      await contracts[user.selectedToken.ticker].methods.approve(
        contracts.dex.options.address, amount)
        .send({from: user.accounts[0]});
      await contracts.dex.methods
        .depositTokens(amount, web3.utils.fromAscii(user.selectedToken.ticker))
        .send({from: user.accounts[0]});
      const tokenBalances = await getTokensBalances(
        user.accounts[0],
        user.selectedToken
      );
      setUser(user => ({...user, tokenBalances}));
    }
    catch (error) {
      handleTransactionError(error);
    }
  }

  const createLimitOrder = async (side, amount, price) => {
    try {
      await contracts.dex.methods.createLimitOrder(
        side, 
        web3.utils.fromAscii(user.selectedToken.ticker),
        amount,
        price
      ).send({from : user.accounts[0]});
      const orders = await getOrders(user.selectedToken);
      setOrders(orders);
    }
    catch (error) {
      handleTransactionError(error);
    }
  }

  const createMarketOrder = async (side, amount) => {
    try {
      await contracts.dex.methods.createMarketOrder(
        side, 
        web3.utils.fromAscii(user.selectedToken.ticker),
        amount
      ).send({from : user.accounts[0]});
      const orders = await getOrders(user.selectedToken);
      setOrders(orders);
    }
    catch (error) {
      handleTransactionError(error);
    }
  }

  const listenToTradeEvent = token => {
    setTrades([]);
    var tradesIds = new Array();
    const listener = contracts.dex.events.NewTrade(
      {
        filter: {ticker: web3.utils.fromAscii(token.ticker)},
        fromBlock: 0
      }
    ).on('data', newTradeEmitted => {
      if (tradesIds.includes(newTradeEmitted.returnValues.idTrade) === true) {
        return;
      }
      else {
        tradesIds.push(newTradeEmitted.returnValues.idTrade);
        setTrades(trades => ([...trades, newTradeEmitted.returnValues]));
      }
    })
    setListener(listener);
  }

  useEffect(() => {
    const init = async() => {
      const nonReadableTokens = await contracts.dex.methods.getTokens().call();
      const tokens = nonReadableTokens.map(token => ({
        ...token,
        ticker: web3.utils.hexToUtf8(token.ticker)
      }));
      const tokenBalances = await getTokensBalances(accounts[0], tokens[0]);
      const orders = await getOrders(tokens[0]);

      //listenToTradeEvent(tokens[0]);
      setTokens(tokens);
      setUser({accounts, selectedToken: tokens[0], tokenBalances});
      setOrders(orders);
    }
    init();
  }, []);

  useEffect(() => {
    const init = async() => {
      const tokenBalances = await getTokensBalances(accounts[0], user.selectedToken);
      const orders = await getOrders(user.selectedToken);

      listenToTradeEvent(user.selectedToken);
      setUser(user => ({...user, tokenBalances}));
      setOrders(orders);
    }
    if (typeof user.selectedToken !== 'undefined') {
      init();
    }
  }, [user.selectedToken], () => {
    listener.unsubscribe();
  });

  if (typeof user.selectedToken === 'undefined') {
    return <div>Loading...</div>;
  }
  
  return (
    <div id="app">
      <Header
        user = {user}
        tokens = {tokens}
        contracts = {contracts}
        selectToken = {selectToken}
        web3 = {web3}
      />
      <main className="container-fluid">
        <div className="row">
          <div className="col-sm-4 first-col">
            <Wallet
              user = {user}
              deposit = {deposit}
              withdraw = {withdraw}
            />
            {user.selectedToken.ticker !== 'EDAI' ? (
              <NewOrder
                createLimitOrder={createLimitOrder}
                createMarketOrder={createMarketOrder}
              />
            )
            : null }
          </div>
          {user.selectedToken.ticker != 'EDAI' ? (
            <div className="col-sm-8">
              <AllTrades
                trades = {trades}
              />
              <AllOrders
                orders = {orders}
              />
              <MyOrders
                orders = {{
                  buy: orders.buy.filter(
                    order => order.trader.toLowerCase() === user.accounts[0].toLowerCase()
                  ),
                  sell: orders.sell.filter(
                    order => order.trader.toLowerCase() === user.accounts[0].toLowerCase()
                  )
                }}
              />
            </div>
          ) : null}
          {user.selectedToken.ticker == 'EDAI' ? (
          <div className="col-sm-8">
              EDAI is used as the quote currency on this exchange. You cannot trade it.
                  
              </div> ) : null }
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
